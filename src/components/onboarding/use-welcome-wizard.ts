"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

import { ONBOARDING_PROGRESS_SHARE } from "@/components/onboarding/onboarding-content";
import { useWelcomeNotifications } from "@/components/onboarding/use-welcome-notifications";
import { CONNECT_STEP, WELCOME_STEPS } from "@/components/onboarding/welcome-content";
import { usePwaInstall } from "@/hooks/use-pwa-install";
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
  const notifications = useWelcomeNotifications(role);
  const install = usePwaInstall();
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

  async function activateNotifications() {
    if (await notifications.activate()) {
      goForward();
    }
  }

  function getPrimaryAction() {
    if (step.id === "notifications" && !notifications.enabled) {
      return {
        label: "Activar notificaciones",
        pending: notifications.loading,
        onClick: activateNotifications,
        offersNotNow: true,
        onNotNow: goForward,
      };
    }

    if (step.id === "install" && !install.installed) {
      return {
        label: "Descargar la aplicación",
        pending: install.loading,
        onClick: install.handleInstall,
        offersNotNow: true,
        onNotNow: goForward,
      };
    }

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
    installGuide: {
      open: install.guideOpen,
      onOpenChange: install.setGuideOpen,
      platform: install.platform,
    },
    isLastStep,
    primaryAction: getPrimaryAction(),
    progress:
      ONBOARDING_PROGRESS_SHARE +
      ((stepIndex + 1) / steps.length) * (1 - ONBOARDING_PROGRESS_SHARE),
    step,
    stepIndex,
  };
}
