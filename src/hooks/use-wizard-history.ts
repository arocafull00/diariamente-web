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

  function resumeAt(target: number) {
    const current = window.history.state?.[HISTORY_STEP_KEY];

    if (typeof current === "number") {
      const next = Math.min(current, target);

      if (next !== current) {
        window.history.replaceState({ ...window.history.state, [HISTORY_STEP_KEY]: next }, "");
      }

      setStep(next);
      return;
    }

    window.history.replaceState({ ...window.history.state, [HISTORY_STEP_KEY]: 0 }, "");

    for (let index = 1; index <= target; index++) {
      window.history.pushState({ [HISTORY_STEP_KEY]: index }, "");
    }

    setStep(target);
  }

  return { goBack, goToStep, resumeAt, step };
}
