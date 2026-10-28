"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { useWelcomeNotifications } from "@/components/onboarding/use-welcome-notifications";
import { WELCOME_FLOWS } from "@/components/onboarding/welcome-content";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { useWizardHistory } from "@/hooks/use-wizard-history";
import { acknowledgeScreen } from "@/server/actions/required-screens";

export function useWelcomeWizard(
  role: "patient" | "psychologist",
  firstName: string,
  finishHref: string,
) {
  const router = useRouter();
  const notifications = useWelcomeNotifications(role);
  const install = usePwaInstall();
  const { goBack, goToStep, step: stepIndex } = useWizardHistory();
  const [goalId, setGoalId] = useState<string | null>(null);
  const [finishing, startFinishTransition] = useTransition();
  const { steps, goals } = WELCOME_FLOWS[role];
  const baseStep = steps[stepIndex];
  const goal = goals.find((item) => item.id === goalId) ?? null;
  const isLastStep = stepIndex === steps.length - 1;
  const canContinue = baseStep.id !== "goal" || goal !== null;
  const step =
    baseStep.id === "goal-reply" && goal
      ? {
          ...baseStep,
          faceId: goal.faceId,
          title: goal.replyTitle,
          description: goal.replyDescription,
        }
      : {
          ...baseStep,
          title: baseStep.title.replace(", {name}", firstName ? `, ${firstName}` : ""),
        };

  function finish() {
    startFinishTransition(async () => {
      await acknowledgeScreen("welcome");
      router.replace(finishHref);
    });
  }

  function goForward() {
    if (!canContinue) {
      return;
    }

    if (isLastStep) {
      finish();
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
      };
    }

    if (step.id === "install" && !install.installed) {
      return {
        label: "Descargar la aplicación",
        pending: install.loading,
        onClick: install.handleInstall,
        offersNotNow: true,
      };
    }

    return {
      label: isLastStep ? "Empezar" : "Continuar",
      pending: finishing,
      onClick: goForward,
      offersNotNow: false,
    };
  }

  return {
    canContinue,
    finish,
    finishing,
    goBack,
    goForward,
    goal,
    goals,
    installGuide: {
      open: install.guideOpen,
      onOpenChange: install.setGuideOpen,
      platform: install.platform,
    },
    isLastStep,
    primaryAction: getPrimaryAction(),
    progress: (stepIndex + 1) / steps.length,
    selectGoal: setGoalId,
    step,
    stepIndex,
  };
}
