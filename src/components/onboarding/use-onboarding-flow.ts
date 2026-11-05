"use client";

import { useEffect, useEffectEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  GOAL_CHOICES,
  ONBOARDING_PROGRESS_SHARE,
  ONBOARDING_STEPS,
  type OnboardingStep,
} from "@/components/onboarding/onboarding-content";
import { useOnboardingAccount } from "@/components/onboarding/use-onboarding-account";
import { useWizardHistory } from "@/hooks/use-wizard-history";
import { clearAccountCreated, markAccountCreated } from "@/lib/account-created-sound";
import { completeOnboarding } from "@/server/actions/onboarding";
import { useOnboardingStore, type OnboardingAnswers } from "@/stores/onboarding-store";
import { onboardingSchema } from "@/validation/schemas";

function fillName(text: string, firstName: string) {
  const name = firstName.trim();
  return text.replace(", {name}", name ? `, ${name}` : "");
}

function toPayload(answers: OnboardingAnswers) {
  return {
    role: answers.role,
    firstName: answers.firstName,
    lastName: answers.lastName,
    clinicName: answers.clinicName,
    grammaticalGender: answers.grammaticalGender,
    avatarUrl: answers.avatarUrl,
    acquisitionSource: answers.acquisitionSource,
    goal: answers.goal,
    therapyStatus: answers.therapyStatus,
    recordsExperience: answers.recordsExperience,
    caseload: answers.caseload,
    legalAccepted: answers.legalAccepted,
  };
}

function canContinueFrom(step: OnboardingStep, answers: OnboardingAnswers) {
  switch (step.id) {
    case "role":
      return answers.role !== null;
    case "name":
      return answers.firstName.trim().length > 0 && answers.lastName.trim().length > 0;
    case "clinic-name":
      return answers.clinicName.trim().length > 0;
    case "gender":
      return answers.grammaticalGender !== null;
    case "source":
      return answers.acquisitionSource !== null;
    case "goal":
      return (
        answers.role !== "clinic" &&
        answers.role !== null &&
        GOAL_CHOICES[answers.role].some((goal) => goal.id === answers.goal)
      );
    case "therapy":
      return answers.therapyStatus !== null;
    case "experience":
      return answers.recordsExperience !== null;
    case "caseload":
      return answers.caseload !== null;
    default:
      return true;
  }
}

function firstPendingIndex(steps: readonly OnboardingStep[], answers: OnboardingAnswers) {
  const index = steps.findIndex((step) => !canContinueFrom(step, answers));
  return index === -1 ? steps.length - 1 : index;
}

function resolveStep(step: OnboardingStep, answers: OnboardingAnswers): OnboardingStep {
  return { ...step, title: fillName(step.title, answers.firstName) };
}

export function useOnboardingFlow() {
  const answers = useOnboardingStore((state) => state.answers);
  const hasHydrated = useOnboardingStore((state) => state.hasHydrated);
  const setAnswer = useOnboardingStore((state) => state.setAnswer);
  const { goBack, goToStep, resumeAt, step: historyStep } = useWizardHistory();
  const [resumed, setResumed] = useState(false);
  const [submitting, startSubmit] = useTransition();
  const steps = ONBOARDING_STEPS[answers.role ?? "patient"];
  const stepIndex = Math.min(historyStep, steps.length - 1);
  const step = resolveStep(steps[stepIndex], answers);
  const accountIndex = steps.findIndex((item) => item.id === "account");

  const resume = useEffectEvent(() => {
    const saved = useOnboardingStore.getState().answers;
    resumeAt(firstPendingIndex(ONBOARDING_STEPS[saved.role ?? "patient"], saved));
    setResumed(true);
  });

  useEffect(() => {
    const { persist } = useOnboardingStore;

    void Promise.resolve(persist.hasHydrated() || persist.rehydrate()).then(() => resume());
  }, []);

  function submitProfile() {
    const parsed = onboardingSchema.safeParse(
      toPayload(useOnboardingStore.getState().answers),
    );

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Algo no cuadra en los datos. Revísalos");
      setAnswer("submitRequested", false);
      return;
    }

    startSubmit(async () => {
      markAccountCreated();
      const result = await completeOnboarding(parsed.data);

      if (result?.error) {
        clearAccountCreated();
        toast.error(result.error);
        setAnswer("submitRequested", false);
        goToStep(accountIndex);
      }
    });
  }

  const account = useOnboardingAccount(submitProfile);
  const canContinue = canContinueFrom(step, answers);

  function goForward() {
    if (!canContinue) {
      return;
    }

    if (step.id === "account") {
      account.confirm();
      return;
    }

    if (steps[stepIndex + 1]?.id === "account" && account.readyToSave) {
      account.confirm();
      return;
    }

    goToStep(stepIndex + 1);
  }

  return {
    account,
    answers,
    busy: submitting || account.busy,
    canContinue,
    goBack,
    goForward,
    progress: ((stepIndex + 1) / steps.length) * ONBOARDING_PROGRESS_SHARE,
    ready: hasHydrated && resumed && account.mode !== "loading",
    setAnswer,
    step,
    stepIndex,
  };
}
