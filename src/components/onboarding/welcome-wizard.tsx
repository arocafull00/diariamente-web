"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

import { useWelcomeWizard } from "@/components/onboarding/use-welcome-wizard";
import { WelcomeFaceBunch } from "@/components/onboarding/welcome-face-bunch";
import { WelcomeFooter } from "@/components/onboarding/welcome-footer";
import { WelcomeInstallStep } from "@/components/onboarding/welcome-install-step";
import { WelcomeInviteStep } from "@/components/onboarding/welcome-invite-step";
import { WelcomeMascot } from "@/components/onboarding/welcome-mascot";
import { WelcomeNotificationsStep } from "@/components/onboarding/welcome-notifications-step";
import { WelcomeTopBar } from "@/components/onboarding/welcome-top-bar";
import { WelcomeTrustCircle } from "@/components/onboarding/welcome-trust-circle";
import { playAccountCreatedSound } from "@/lib/account-created-sound";

type WelcomeWizardProps = {
  role: "patient" | "psychologist";
  firstName: string;
  finishHref: string;
  inviteToken: string | null;
  origin: string;
  showConnect: boolean;
};

export function WelcomeWizard({
  role,
  firstName,
  finishHref,
  inviteToken,
  origin,
  showConnect,
}: WelcomeWizardProps) {
  const {
    finish,
    finishing,
    goBack,
    installGuide,
    isLastStep,
    primaryAction,
    progress,
    step,
    stepIndex,
  } = useWelcomeWizard(role, firstName, finishHref, showConnect);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hero = step.id === "ready" || step.id === "connect";

  useEffect(() => {
    playAccountCreatedSound();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });

    if (stepIndex > 0) {
      headingRef.current?.focus();
    }
  }, [stepIndex]);

  return (
    <div className="flex w-full flex-1 flex-col lg:mx-auto lg:max-w-xl">
      <WelcomeTopBar
        progress={progress}
        showBack={stepIndex > 0}
        showSkip={!isLastStep}
        disabled={finishing}
        onBack={goBack}
        onSkip={finish}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className={
            hero
              ? "flex flex-1 flex-col justify-center gap-8 pt-8"
              : "flex flex-1 flex-col justify-center gap-7 pt-8"
          }
        >
          <WelcomeMascot
            faceId={step.faceId}
            title={step.title}
            description={step.description}
            hero={hero && !step.faceRow}
            titleRef={headingRef}
          />

          {step.faceRow ? <WelcomeFaceBunch faceIds={step.faceRow} /> : null}
          {step.id === "connect" ? <WelcomeTrustCircle /> : null}
          {step.id === "notifications" ? (
            <WelcomeNotificationsStep role={role} />
          ) : null}
          {step.id === "invite" ? (
            <WelcomeInviteStep token={inviteToken} origin={origin} />
          ) : null}
          {step.id === "install" ? (
            <WelcomeInstallStep
              guideOpen={installGuide.open}
              onGuideOpenChange={installGuide.onOpenChange}
              platform={installGuide.platform}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>

      <WelcomeFooter
        label={primaryAction.label}
        disabled={false}
        pending={primaryAction.pending}
        offersNotNow={primaryAction.offersNotNow}
        showSignOut
        onPrimary={primaryAction.onClick}
        onNotNow={primaryAction.onNotNow}
      />
    </div>
  );
}
