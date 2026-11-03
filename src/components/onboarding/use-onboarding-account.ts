"use client";

import { useSignUp, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { EmailPasswordValues } from "@/components/auth/auth-types";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { logger } from "@/lib/logger";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { emailPasswordSchema } from "@/validation/schemas";

type OnboardingAccountMode = "loading" | "create" | "pending" | "signed-in";

type SignUpOutcome = "failed" | "ready" | "redirecting";

const SIGN_UP_ERROR = "Uy, no hemos podido crear tu cuenta";
const LEGAL_ERROR =
  "Necesitamos que aceptes los términos y la política de privacidad para seguir";
const SIGN_UP_TIMEOUT_MS = 15000;
const SIGN_UP_TIMEOUT_ERROR = Symbol("sign-up-timeout");

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(SIGN_UP_TIMEOUT_ERROR), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export function useOnboardingAccount(submitProfile: () => void) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signUp, fetchStatus } = useSignUp();
  const hasHydrated = useOnboardingStore((state) => state.hasHydrated);
  const legalAccepted = useOnboardingStore((state) => state.answers.legalAccepted);
  const submitRequested = useOnboardingStore((state) => state.answers.submitRequested);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const [legalError, setLegalError] = useState<string | undefined>();
  const [working, setWorking] = useState(false);
  const didResume = useRef(false);
  const credentialsForm = useForm<EmailPasswordValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: "", password: "" },
  });
  const hasPendingSignUp =
    Boolean(signUp.id) && signUp.status !== "abandoned" && signUp.status !== "complete";
  const mode: OnboardingAccountMode = !isLoaded
    ? "loading"
    : isSignedIn
      ? "signed-in"
      : hasPendingSignUp
        ? "pending"
        : "create";
  const requiresLegal =
    mode === "create" ||
    (mode === "signed-in" ? !user?.legalAcceptedAt : !signUp.legalAcceptedAt);

  function changeLegal(checked: boolean) {
    setAnswer("legalAccepted", checked);
    if (checked) {
      setLegalError(undefined);
    }
  }

  function ensureLegal() {
    if (!requiresLegal || useOnboardingStore.getState().answers.legalAccepted) {
      return true;
    }

    setLegalError(LEGAL_ERROR);
    return false;
  }

  function fail(message: string) {
    toast.error(message);
    setAnswer("submitRequested", false);
    setWorking(false);
  }

  async function finalizeSignUp(): Promise<SignUpOutcome> {
    let outcome = "failed" as SignUpOutcome;
    const { error } = await signUp.finalize({
      navigate: async ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          logger.warn("auth.signup.pending_task", { task: session.currentTask.key });
          return;
        }

        const url = decorateUrl("/onboarding");
        if (url.startsWith("http")) {
          outcome = "redirecting";
          window.location.href = url;
          return;
        }

        outcome = "ready";
      },
    });

    if (error) {
      logger.error("auth.signup.finalize_failed", error);
      toast.error(getAuthErrorMessage(error, "Uy, no hemos podido iniciar sesión"));
      return "failed";
    }

    return outcome;
  }

  async function completePendingSignUp(): Promise<SignUpOutcome> {
    const { firstName, lastName } = useOnboardingStore.getState().answers;

    if (signUp.status !== "complete") {
      const { error } = await signUp.update({
        firstName,
        lastName,
        ...(requiresLegal ? { legalAccepted: true } : {}),
      });

      if (error) {
        logger.error("auth.signup.update_failed", error, { signUpStatus: signUp.status });
        toast.error(getAuthErrorMessage(error, SIGN_UP_ERROR));
        return "failed";
      }
    }

    if (signUp.status !== "complete") {
      logger.error(
        "auth.signup.incomplete",
        new Error("Sign-up is not complete after update"),
        { signUpStatus: signUp.status, missingFields: signUp.missingFields.join(",") },
      );
      toast.error("Uy, no hemos podido terminar de crear tu cuenta. Vuelve a iniciar sesión.");
      return "failed";
    }

    return finalizeSignUp();
  }

  async function runSignUp(task: () => Promise<SignUpOutcome>) {
    setWorking(true);

    let outcome: SignUpOutcome;
    try {
      outcome = await withTimeout(task(), SIGN_UP_TIMEOUT_MS);
    } catch (error) {
      fail(
        error === SIGN_UP_TIMEOUT_ERROR
          ? "Esto está tardando más de la cuenta. Revisa tu conexión y vuelve a probar."
          : SIGN_UP_ERROR,
      );
      return;
    }

    if (outcome === "redirecting") {
      return;
    }

    if (outcome === "failed") {
      setAnswer("submitRequested", false);
      setWorking(false);
      return;
    }

    setWorking(false);
    submitProfile();
  }

  const submitCredentials = credentialsForm.handleSubmit(async ({ email, password }) => {
    if (!ensureLegal()) {
      return;
    }

    setAnswer("submitRequested", true);

    await runSignUp(async () => {
      const { firstName, lastName } = useOnboardingStore.getState().answers;
      const { error } = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        legalAccepted: true,
      });

      if (error) {
        toast.error(getAuthErrorMessage(error, SIGN_UP_ERROR));
        return "failed";
      }

      if (signUp.status !== "complete") {
        logger.error(
          "auth.signup.password_unresolved",
          new Error("Password sign-up ended in an unsupported status"),
          { signUpStatus: signUp.status, missingFields: signUp.missingFields.join(",") },
        );
        toast.error(SIGN_UP_ERROR);
        return "failed";
      }

      return finalizeSignUp();
    });
  });

  function startGoogle() {
    if (!ensureLegal()) {
      return false;
    }

    setAnswer("submitRequested", true);
    return true;
  }

  function confirm() {
    if (!ensureLegal()) {
      return;
    }

    setAnswer("submitRequested", true);

    if (mode === "signed-in") {
      submitProfile();
      return;
    }

    void runSignUp(completePendingSignUp);
  }

  const resume = useEffectEvent(() => {
    const { answers } = useOnboardingStore.getState();
    const firstName = isSignedIn ? user?.firstName : signUp.firstName;
    const lastName = isSignedIn ? user?.lastName : signUp.lastName;

    if (!answers.firstName && firstName) {
      setAnswer("firstName", firstName);
    }

    if (!answers.lastName && lastName) {
      setAnswer("lastName", lastName);
    }

    if (!answers.submitRequested) {
      return;
    }

    if (mode === "signed-in") {
      submitProfile();
      return;
    }

    if (mode === "pending") {
      void runSignUp(completePendingSignUp);
      return;
    }

    setAnswer("submitRequested", false);
  });

  useEffect(() => {
    if (!isLoaded || !hasHydrated || fetchStatus === "fetching" || didResume.current) {
      return;
    }

    didResume.current = true;
    resume();
  }, [fetchStatus, hasHydrated, isLoaded]);

  return {
    mode,
    requiresLegal,
    legalAccepted,
    legalError,
    changeLegal,
    credentialsForm,
    submitCredentials,
    startGoogle,
    confirm,
    busy: working || (submitRequested && mode !== "create"),
  };
}
