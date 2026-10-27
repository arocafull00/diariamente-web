"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

import { useWelcomeWizard } from "@/components/onboarding/use-welcome-wizard";
import { WelcomeFaceBunch } from "@/components/onboarding/welcome-face-bunch";
import { WelcomeFeatureList } from "@/components/onboarding/welcome-feature-list";
import { WelcomeFooter } from "@/components/onboarding/welcome-footer";
import { WelcomeGoalList } from "@/components/onboarding/welcome-goal-list";
import { WelcomeInstallStep } from "@/components/onboarding/welcome-install-step";
import { WelcomeInviteStep } from "@/components/onboarding/welcome-invite-step";
import { WelcomeMascot } from "@/components/onboarding/welcome-mascot";
import { WelcomeNotificationsStep } from "@/components/onboarding/welcome-notifications-step";
import { WelcomeTrustCircle } from "@/components/onboarding/welcome-trust-circle";
import { WelcomeTopBar } from "@/components/onboarding/welcome-top-bar";

type WelcomeWizardProps = {
  role: "patient" | "psychologist";
  profileId: string;
  firstName: string;
  finishHref: string;
  inviteToken: string | null;
  origin: string;
};

export function WelcomeWizard({
  role,
  profileId,
  firstName,
  finishHref,
  inviteToken,
  origin,
}: WelcomeWizardProps) {
  const {
    canContinue,
    finish,
    finishing,
    goBack,
    goForward,
    goal,
    goals,
    installGuide,
    isLastStep,
    primaryAction,
    progress,
    selectGoal,
    step,
    stepIndex,
  } = useWelcomeWizard(role, profileId, firstName, finishHref);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hero =
    !step.features &&
    !step.faceRow &&
    !["goal", "safe-space", "notifications", "invite", "install"].includes(step.id);

  useEffect(() => {
    if (stepIndex > 0) {
      headingRef.current?.focus();
    }
  }, [stepIndex]);

  return (
    <div className="flex w-full flex-1 flex-col lg:mx-auto lg:my-auto lg:max-w-xl lg:flex-none">
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
            hero={hero}
            titleRef={headingRef}
          />

          {step.faceRow ? <WelcomeFaceBunch faceIds={step.faceRow} /> : null}

          {step.id === "goal" ? (
            <WelcomeGoalList
              goals={goals}
              selectedId={goal?.id ?? null}
              onSelect={selectGoal}
            />
          ) : null}
          {step.features ? <WelcomeFeatureList features={step.features} /> : null}
          {step.id === "safe-space" ? <WelcomeTrustCircle /> : null}
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
        disabled={!canContinue}
        pending={primaryAction.pending}
        offersNotNow={primaryAction.offersNotNow}
        onPrimary={primaryAction.onClick}
        onNotNow={goForward}
      />
    </div>
  );
}
