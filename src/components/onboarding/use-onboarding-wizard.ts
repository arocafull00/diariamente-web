"use client";

import { useSignUp, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  OnboardingFormValues,
  OnboardingStep,
} from "@/components/onboarding/onboarding-types";
import { useWizardHistory } from "@/hooks/use-wizard-history";
import { logger } from "@/lib/logger";
import { completeOnboarding } from "@/server/actions/onboarding";
import { onboardingSchema } from "@/validation/schemas";

const initialState = { error: undefined as string | undefined };
const DRAFT_KEY = "diariamente.onboarding-draft";
const LEGAL_ERROR =
  "Debes aceptar los términos de servicio y la política de privacidad";
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

function readDraft(): OnboardingFormValues | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return null;
    }

    const parsed = onboardingSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function toFormData(values: OnboardingFormValues) {
  const formData = new FormData();
  formData.set("firstName", values.firstName);
  formData.set("lastName", values.lastName);
  formData.set("role", values.role);
  formData.set("grammaticalGender", values.grammaticalGender);
  formData.set("avatarUrl", values.avatarUrl ?? "");
  return formData;
}

export function useOnboardingWizard() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signUp, fetchStatus } = useSignUp();
  const { goBack, goToStep, step: historyStep } = useWizardHistory();
  const step = historyStep as OnboardingStep;
  const [state, formAction, actionPending] = useActionState(
    completeOnboarding,
    initialState,
  );
  const [legalAccepted, setLegalAcceptedState] = useState(false);
  const [legalError, setLegalError] = useState<string | undefined>();
  const [isCompletingSignUp, setIsCompletingSignUp] = useState(false);
  const didInit = useRef(false);
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      role: undefined,
      grammaticalGender: undefined,
      avatarUrl: null,
    },
    mode: "onTouched",
  });
  const requiresLegalAcceptance =
    isLoaded && !isSignedIn && signUp.missingFields.includes("legal_accepted");

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  useEffect(() => {
    if (!isLoaded || fetchStatus === "fetching" || didInit.current) {
      return;
    }

    if (isSignedIn) {
      didInit.current = true;
      const draft = readDraft();

      if (draft) {
        sessionStorage.removeItem(DRAFT_KEY);
        form.reset(draft);
        formAction(toFormData(draft));
        return;
      }

      const current = form.getValues();
      if (!current.firstName && user?.firstName) {
        form.setValue("firstName", user.firstName);
      }
      if (!current.lastName && user?.lastName) {
        form.setValue("lastName", user.lastName);
      }
      return;
    }

    if (signUp.id && signUp.status !== "abandoned") {
      didInit.current = true;
      const current = form.getValues();
      if (!current.firstName && signUp.firstName) {
        form.setValue("firstName", signUp.firstName);
      }
      if (!current.lastName && signUp.lastName) {
        form.setValue("lastName", signUp.lastName);
      }
      return;
    }

    didInit.current = true;
    router.replace("/login");
  }, [
    fetchStatus,
    form,
    formAction,
    isLoaded,
    isSignedIn,
    router,
    signUp.firstName,
    signUp.id,
    signUp.lastName,
    signUp.status,
    user?.firstName,
    user?.lastName,
  ]);

  function setLegalAccepted(checked: boolean) {
    setLegalAcceptedState(checked);
    if (checked) {
      setLegalError(undefined);
    }
  }

  async function goForward() {
    const fields: (keyof OnboardingFormValues)[] =
      step === 0
        ? ["firstName", "lastName", "grammaticalGender"]
        : ["role"];
    const valid = await form.trigger(fields, { shouldFocus: true });

    if (!valid) {
      return;
    }

    goToStep(step + 1);
  }

  async function finishPendingSignUp(values: OnboardingFormValues) {
    if (signUp.status !== "complete") {
      const { error } = await signUp.update({
        firstName: values.firstName,
        lastName: values.lastName,
        ...(requiresLegalAcceptance ? { legalAccepted: true } : {}),
      });

      if (error) {
        logger.error("auth.signup.update_failed", error, {
          signUpStatus: signUp.status,
        });
        toast.error(error.message ?? "No se pudo completar el registro");
        return "failed" as const;
      }
    }

    if (signUp.status !== "complete") {
      logger.error(
        "auth.signup.incomplete",
        new Error("Sign-up is not complete after update"),
        {
          signUpStatus: signUp.status,
          missingFields: signUp.missingFields.join(","),
        },
      );
      toast.error("No se pudo completar el registro. Vuelve a iniciar sesión.");
      return "failed" as const;
    }

    let outcome = "failed" as "failed" | "ready" | "redirecting";
    const { error } = await signUp.finalize({
      navigate: async ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          logger.warn("auth.signup.pending_task", {
            task: session.currentTask.key,
          });
          toast.error(
            "Tu cuenta requiere un paso adicional. Vuelve a iniciar sesión para continuar.",
          );
          return;
        }

        const url = decorateUrl("/onboarding");
        if (url.startsWith("http")) {
          sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
          outcome = "redirecting";
          window.location.href = url;
          return;
        }

        outcome = "ready";
      },
    });

    if (error) {
      logger.error("auth.signup.finalize_failed", error);
      toast.error(error.message ?? "No se pudo iniciar sesión");
      return "failed" as const;
    }

    return outcome;
  }

  async function createProfile(formElement: HTMLFormElement) {
    const parsed = onboardingSchema.safeParse(form.getValues());
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }

    if (requiresLegalAcceptance && !legalAccepted) {
      setLegalError(LEGAL_ERROR);
      return;
    }

    if (!isSignedIn) {
      setIsCompletingSignUp(true);

      let outcome: "failed" | "ready" | "redirecting";
      try {
        outcome = await withTimeout(
          finishPendingSignUp(parsed.data),
          SIGN_UP_TIMEOUT_MS,
        );
      } catch (error) {
        if (error === SIGN_UP_TIMEOUT_ERROR) {
          toast.error(
            "La conexión está tardando demasiado. Comprueba tu conexión e inténtalo de nuevo.",
          );
        } else {
          toast.error("No se pudo completar el registro");
        }
        setIsCompletingSignUp(false);
        return;
      }

      if (outcome !== "ready") {
        if (outcome === "failed") {
          setIsCompletingSignUp(false);
        }
        return;
      }
    }

    formAction(new FormData(formElement));
  }

  return {
    form,
    formAction,
    goBack,
    goForward,
    createProfile,
    pending: actionPending || isCompletingSignUp,
    requiresLegalAcceptance,
    legalAccepted,
    legalError,
    setLegalAccepted,
    state,
    step,
  };
}
