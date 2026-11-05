"use client";

import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type BaseSyntheticEvent,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { EmailPasswordValues } from "@/components/auth/auth-types";
import { getAuthErrorCode, getAuthErrorMessage } from "@/lib/auth-errors";
import { logger } from "@/lib/logger";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { emailPasswordSchema } from "@/validation/schemas";

type OnboardingAccountMode = "loading" | "create" | "pending" | "signed-in";

type SignUpOutcome = "failed" | "ready" | "redirecting";

const SIGN_UP_ERROR = "Uy, no hemos podido crear tu cuenta";
const SIGN_IN_ERROR = "Uy, no hemos podido iniciar sesión";
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
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signUp, fetchStatus } = useSignUp();
  const { signIn } = useSignIn();
  const hasHydrated = useOnboardingStore((state) => state.hasHydrated);
  const legalAccepted = useOnboardingStore((state) => state.answers.legalAccepted);
  const submitRequested = useOnboardingStore((state) => state.answers.submitRequested);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const [legalError, setLegalError] = useState<string | undefined>();
  const [takenEmail, setTakenEmail] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const didResume = useRef(false);
  const credentialsForm = useForm<EmailPasswordValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: "", password: "" },
  });
  const emailValue = useWatch({ control: credentialsForm.control, name: "email" });
  const emailTaken = takenEmail !== null && takenEmail === emailValue.trim().toLowerCase();
  const hasPendingSignUp =
    Boolean(signUp.id) &&
    signUp.status !== "abandoned" &&
    signUp.status !== "complete" &&
    Boolean(signUp.emailAddress) &&
    !signUp.missingFields.includes("email_address") &&
    signUp.verifications.externalAccount.status === "verified";
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

  async function discardSignUp() {
    if (signUp.id) {
      await signUp.reset();
    }

    setAnswer("submitRequested", false);
    setWorking(false);
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
        if (!session) {
          logger.error(
            "auth.signup.no_session",
            new Error("Sign-up finalized without a session"),
            { signUpStatus: signUp.status },
          );
          return;
        }

        if (session.currentTask) {
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

    if (outcome === "failed") {
      toast.error("Uy, no hemos podido terminar de crear tu cuenta. Inténtalo otra vez.");
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
        await discardSignUp();
        return "failed";
      }
    }

    if (signUp.status !== "complete") {
      logger.error(
        "auth.signup.incomplete",
        new Error("Sign-up is not complete after update"),
        { signUpStatus: signUp.status, missingFields: signUp.missingFields.join(",") },
      );
      toast.error("Uy, no hemos podido terminar de crear tu cuenta. Prueba otra vez.");
      await discardSignUp();
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

  async function signInExisting(email: string, password: string) {
    setWorking(true);

    if (signIn.id) {
      await signIn.reset();
    }

    const { error } = await signIn.password({ emailAddress: email, password });

    if (error) {
      setWorking(false);
      credentialsForm.setError("password", {
        message: getAuthErrorMessage(error, SIGN_IN_ERROR),
      });
      return;
    }

    if (signIn.status !== "complete") {
      setWorking(false);
      toast.error("Necesitamos un paso más para entrar con esta cuenta");
      router.push(`/login?email=${encodeURIComponent(email.trim())}`);
      return;
    }

    const { error: finalizeError } = await signIn.finalize({
      navigate: async () => {
        window.location.assign("/");
      },
    });

    if (finalizeError) {
      setWorking(false);
      logger.error("auth.signup.sign_in_finalize_failed", finalizeError);
      toast.error(getAuthErrorMessage(finalizeError, SIGN_IN_ERROR));
    }
  }

  const submitNewAccount = credentialsForm.handleSubmit(async ({ email, password }) => {
    if (takenEmail !== null && takenEmail === email.trim().toLowerCase()) {
      await signInExisting(email, password);
      return;
    }

    if (!ensureLegal()) {
      return;
    }

    setAnswer("submitRequested", true);

    await runSignUp(async () => {
      const { firstName, lastName } = useOnboardingStore.getState().answers;

      if (signUp.id && !hasPendingSignUp) {
        await signUp.reset();
      }

      const { error } = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        legalAccepted: true,
      });

      if (error) {
        await discardSignUp();

        const code = getAuthErrorCode(error);

        if (code === "form_identifier_exists") {
          setTakenEmail(email.trim().toLowerCase());
          await signInExisting(email, password);
          return "failed";
        }

        if (code?.startsWith("form_password")) {
          credentialsForm.setError("password", {
            message: getAuthErrorMessage(error, SIGN_UP_ERROR),
          });
          return "failed";
        }

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
        await discardSignUp();
        return "failed";
      }

      return finalizeSignUp();
    });
  });

  function submitCredentials(event?: BaseSyntheticEvent) {
    if (mode === "create") {
      void submitNewAccount(event);
      return;
    }

    event?.preventDefault();
    confirm();
  }

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

    const email = isSignedIn ? user?.primaryEmailAddress?.emailAddress : signUp.emailAddress;

    if (!credentialsForm.getValues("email") && email) {
      credentialsForm.setValue("email", email);
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
    emailTaken,
    readyToSave: mode !== "loading" && mode !== "create" && (!requiresLegal || legalAccepted),
    busy: (working || submitRequested) && mode !== "create",
  };
}
