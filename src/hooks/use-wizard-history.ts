"use client";

import { useEffect, useState } from "react";

const HISTORY_STEP_KEY = "wizardStep";

export function useWizardHistory() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      setStep(event.state?.[HISTORY_STEP_KEY] ?? 0);
    }

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function goToStep(nextStep: number) {
    window.history.pushState({ [HISTORY_STEP_KEY]: nextStep }, "");
    setStep(nextStep);
  }

  function goBack() {
    window.history.back();
  }

  return { goBack, goToStep, step };
}
