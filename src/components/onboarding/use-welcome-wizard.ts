"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  PATIENT_WELCOME_STEPS,
  PSYCHOLOGIST_WELCOME_STEPS,
} from "@/components/onboarding/welcome-content";

export function useWelcomeWizard(
  role: "patient" | "psychologist",
  finishHref: string,
) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [finishing, startFinishTransition] = useTransition();
  const steps =
    role === "patient" ? PATIENT_WELCOME_STEPS : PSYCHOLOGIST_WELCOME_STEPS;
  const isLastStep = stepIndex === steps.length - 1;

  function finish() {
    startFinishTransition(() => {
      router.replace(finishHref);
    });
  }

  function goForward() {
    if (isLastStep) {
      finish();
      return;
    }

    setStepIndex(stepIndex + 1);
  }

  function goBack() {
    setStepIndex(stepIndex - 1);
  }

  return {
    finish,
    finishing,
    goBack,
    goForward,
    isLastStep,
    step: steps[stepIndex],
    stepIndex,
    steps,
  };
}
