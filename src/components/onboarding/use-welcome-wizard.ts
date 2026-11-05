"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

import { ONBOARDING_PROGRESS_SHARE } from "@/components/onboarding/onboarding-content";
import { CONNECT_STEP, WELCOME_STEPS } from "@/components/onboarding/welcome-content";
import { useWizardHistory } from "@/hooks/use-wizard-history";
import { playCompletionSound } from "@/lib/completion-sound";
import { acknowledgeScreen } from "@/server/actions/required-screens";
import { useOnboardingStore } from "@/stores/onboarding-store";

const FIRST_RECORD_HREF = "/nuevo-registro";

export function useWelcomeWizard(
  role: "patient" | "psychologist",
  firstName: string,
  finishHref: string,
  showConnect: boolean,
) {
  const router = useRouter();
  const { goBack, goToStep, step: stepIndex } = useWizardHistory();
  const [finishing, startFinishTransition] = useTransition();
  const steps = showConnect ? [CONNECT_STEP, ...WELCOME_STEPS[role]] : WELCOME_STEPS[role];
  const baseStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const offersFirstRecord = role === "patient" && finishHref === "/inicio";
  const step = {
    ...baseStep,
    title: baseStep.title.replace(", {name}", firstName ? `, ${firstName}` : ""),
  };

  useEffect(() => {
    useOnboardingStore.getState().reset();
    useOnboardingStore.persist.clearStorage();
  }, []);

  function finish(href: string) {
    startFinishTransition(async () => {
      await acknowledgeScreen("welcome");
      router.replace(href);
    });
  }

  function goForward() {
    if (isLastStep) {
      playCompletionSound();
      finish(offersFirstRecord ? FIRST_RECORD_HREF : finishHref);
      return;
    }

    goToStep(stepIndex + 1);
  }

  function getPrimaryAction() {
    if (isLastStep && offersFirstRecord) {
      return {
        label: "Hacer mi primer registro",
        pending: finishing,
        onClick: goForward,
        offersNotNow: true,
        onNotNow: () => finish(finishHref),
      };
    }

    return {
      label: isLastStep ? "Empezar" : "Continuar",
      pending: finishing,
      onClick: goForward,
      offersNotNow: false,
      onNotNow: goForward,
    };
  }

  return {
    finish: () => finish(finishHref),
    finishing,
    goBack,
    isLastStep,
    primaryAction: getPrimaryAction(),
    progress:
      ONBOARDING_PROGRESS_SHARE +
      ((stepIndex + 1) / steps.length) * (1 - ONBOARDING_PROGRESS_SHARE),
    step,
    stepIndex,
  };
}
