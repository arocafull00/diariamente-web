"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import logo from "../../../public/logo.png";

import { FaceCluster } from "@/components/faces/face-cluster";
import { useWelcomeWizard } from "@/components/onboarding/use-welcome-wizard";
import { WelcomeFeatureList } from "@/components/onboarding/welcome-feature-list";
import { WelcomeInstallStep } from "@/components/onboarding/welcome-install-step";
import { WelcomeInviteStep } from "@/components/onboarding/welcome-invite-step";
import { WelcomeReminderStep } from "@/components/onboarding/welcome-reminder-step";
import { Button } from "@/components/ui/button";
import { WizardFooter } from "@/components/wizard/wizard-footer";
import { WizardShell } from "@/components/wizard/wizard-shell";

type WelcomeWizardProps = {
  role: "patient" | "psychologist";
  finishHref: string;
  remindersEnabled: boolean;
  inviteToken: string | null;
  origin: string;
};

export function WelcomeWizard({
  role,
  finishHref,
  remindersEnabled,
  inviteToken,
  origin,
}: WelcomeWizardProps) {
  const {
    finish,
    finishing,
    goBack,
    goForward,
    isLastStep,
    step,
    stepIndex,
    steps,
  } = useWelcomeWizard(role, finishHref);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (stepIndex > 0) {
      headingRef.current?.focus();
    }
  }, [stepIndex]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <WizardShell
        step={stepIndex}
        steps={steps.map((item) => item.label)}
        title={step.title}
        description={step.description}
        titleRef={headingRef}
        progressAriaLabel="Progreso de la bienvenida"
        header={
          <header className="relative flex items-center justify-center gap-2.5 py-1">
            <Image
              src={logo}
              alt=""
              width={44}
              height={44}
              priority
              className="size-11 object-contain"
            />
            <p className="text-lg font-bold tracking-tight text-primary">Diariamente</p>
            {isLastStep ? null : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 text-foreground/65"
                disabled={finishing}
                onClick={finish}
              >
                Saltar
              </Button>
            )}
          </header>
        }
        footer={
          <WizardFooter
            showBack={stepIndex > 0}
            onBack={goBack}
            backDisabled={finishing}
            primaryLabel={isLastStep ? "Empezar" : "Continuar"}
            primaryPending={finishing}
            onPrimaryClick={goForward}
          />
        }
      >
        {stepIndex === 0 ? <FaceCluster className="mb-8 max-w-60" /> : null}
        {step.features ? <WelcomeFeatureList features={step.features} /> : null}
        {step.id === "reminder" ? (
          <WelcomeReminderStep remindersEnabled={remindersEnabled} />
        ) : null}
        {step.id === "invite" ? (
          <WelcomeInviteStep token={inviteToken} origin={origin} />
        ) : null}
        {step.id === "install" ? <WelcomeInstallStep /> : null}
      </WizardShell>
    </div>
  );
}
