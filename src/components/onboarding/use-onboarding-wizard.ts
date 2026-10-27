"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  OnboardingFormValues,
  OnboardingStep,
} from "@/components/onboarding/onboarding-types";
import { useWizardHistory } from "@/hooks/use-wizard-history";
import { completeOnboarding } from "@/server/actions/onboarding";
import { onboardingSchema } from "@/validation/schemas";

const initialState = { error: undefined as string | undefined };

export function useOnboardingWizard() {
  const { goBack, goToStep, step: historyStep } = useWizardHistory();
  const step = historyStep as OnboardingStep;
  const [state, formAction, pending] = useActionState(
    completeOnboarding,
    initialState,
  );
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

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

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

  return { form, formAction, goBack, goForward, pending, state, step };
}
