"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

import { OnboardingAccountStep } from "@/components/onboarding/onboarding-account-step";
import { OnboardingSaving } from "@/components/onboarding/onboarding-saving";
import { OnboardingStepBody } from "@/components/onboarding/onboarding-step-body";
import { useOnboardingFlow } from "@/components/onboarding/use-onboarding-flow";
import { WelcomeFooter } from "@/components/onboarding/welcome-footer";
import { WelcomeMascot } from "@/components/onboarding/welcome-mascot";
import { WelcomeTopBar } from "@/components/onboarding/welcome-top-bar";

function noop() {}

export function OnboardingFlow() {
  const {
    account,
    answers,
    busy,
    canContinue,
    goBack,
    goForward,
    progress,
    ready,
    setAnswer,
    step,
    stepIndex,
  } = useOnboardingFlow();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isAccountStep = step.id === "account";
  const hasAccount = account.mode !== "create";

  useEffect(() => {
    window.scrollTo({ top: 0 });

    if (stepIndex > 0) {
      headingRef.current?.focus();
    }
  }, [stepIndex]);

  if (!ready || busy) {
    return <OnboardingSaving saving={busy} />;
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      <WelcomeTopBar
        progress={progress}
        showBack={stepIndex > 0}
        showSkip={false}
        disabled={false}
        onBack={goBack}
        onSkip={noop}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="flex flex-1 flex-col items-center justify-center gap-7 py-8 *:w-full"
        >
          <WelcomeMascot
            faceId={step.faceId}
            title={step.title}
            description=""
            hero={Boolean(step.hero)}
            titleRef={headingRef}
          />

          {isAccountStep ? (
            <OnboardingAccountStep
              hasAccount={hasAccount}
              requiresLegal={account.requiresLegal}
              legalAccepted={account.legalAccepted}
              legalError={account.legalError}
              onLegalChange={account.changeLegal}
              credentialsForm={account.credentialsForm}
              onSubmitCredentials={account.submitCredentials}
              onGoogleStart={account.startGoogle}
              emailTaken={account.emailTaken}
              onUseAnotherEmail={
                account.mode === "pending" ? account.discardSignUp : undefined
              }
            />
          ) : (
            <OnboardingStepBody
              stepId={step.id}
              answers={answers}
              setAnswer={setAnswer}
              onSubmit={goForward}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {isAccountStep && !hasAccount ? (
        <div className="pb-[max(1.5rem,env(safe-area-inset-bottom))]" />
      ) : (
        <WelcomeFooter
          label={isAccountStep ? "Crear mi perfil" : "Continuar"}
          disabled={!canContinue}
          pending={false}
          offersNotNow={false}
          showSignOut={hasAccount}
          onPrimary={goForward}
          onNotNow={noop}
        />
      )}
    </div>
  );
}
