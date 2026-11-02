"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";

import logo from "../../../public/logo.png";

import { SignOutLink } from "@/components/auth/sign-out-link";
import { OnboardingLegalAcceptance } from "@/components/onboarding/onboarding-legal-acceptance";
import { OnboardingPersonalStep } from "@/components/onboarding/onboarding-personal-step";
import { OnboardingReviewStep } from "@/components/onboarding/onboarding-review-step";
import { OnboardingRoleStep } from "@/components/onboarding/onboarding-role-step";
import { useOnboardingWizard } from "@/components/onboarding/use-onboarding-wizard";
import { WizardFooter } from "@/components/wizard/wizard-footer";
import { WizardShell } from "@/components/wizard/wizard-shell";

const STEP_LABELS = ["Tus datos", "Tu perfil", "Confirmación"] as const;

const STEP_CONTENT = [
  {
    title: undefined,
    description: undefined,
  },
  {
    title: "¿Cómo vas a usar Diariamente?",
    description: "Así te enseñamos justo lo que necesitas.",
  },
  {
    title: "¡Ya casi está!",
    description: "Echa un último vistazo a tus datos y creamos tu espacio.",
  },
] as const;

export function OnboardingWizard() {
  const {
    createProfile,
    form,
    formAction,
    goBack,
    goForward,
    legalAccepted,
    legalError,
    pending,
    requiresLegalAcceptance,
    setLegalAccepted,
    state,
    step,
  } = useOnboardingWizard();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const values = form.getValues();

  useEffect(() => {
    if (step > 0) {
      headingRef.current?.focus();
    }
  }, [step]);

  return (
    <form
      action={formAction}
      noValidate
      className="flex w-full flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        if (step < 2) {
          void goForward();
          return;
        }

        void createProfile(event.currentTarget);
      }}
    >
      <WizardShell
        step={step}
        steps={STEP_LABELS}
        title={STEP_CONTENT[step].title}
        description={STEP_CONTENT[step].description}
        titleRef={headingRef}
        progressAriaLabel="Progreso del registro"
        error={state.error && step === 2 ? state.error : undefined}
        header={
          <header className="flex items-center justify-center gap-2.5 py-1">
            <Image
              src={logo}
              alt=""
              width={44}
              height={44}
              priority
              className="size-11 object-contain"
            />
            <p className="text-lg font-bold tracking-tight text-primary">Diariamente</p>
          </header>
        }
        footer={
          <div className="flex flex-col gap-4">
            <WizardFooter
              showBack={step > 0}
              onBack={goBack}
              backDisabled={pending}
              primaryLabel={
                step < 2 ? "Continuar" : pending ? "Creando perfil..." : "Crear perfil"
              }
              primaryType="submit"
              primaryDisabled={step === 2 && pending}
              primaryPending={step === 2 && pending}
              primaryIcon={step < 2 ? "continue" : "create"}
            />
            <SignOutLink />
          </div>
        }
      >
        {step === 0 ? (
          <OnboardingPersonalStep
            control={form.control}
            errors={form.formState.errors}
            register={form.register}
          />
        ) : null}

        {step === 1 ? (
          <Controller
            control={form.control}
            name="role"
            render={({ field, fieldState }) => (
              <OnboardingRoleStep
                value={field.value}
                error={fieldState.error?.message}
                inputRef={field.ref}
                name={field.name}
                onChange={field.onChange}
                register={form.register}
                clinicNameError={form.formState.errors.clinicName?.message}
              />
            )}
          />
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5">
            <OnboardingReviewStep values={values} />
            {requiresLegalAcceptance ? (
              <OnboardingLegalAcceptance
                checked={legalAccepted}
                error={legalError}
                onChange={setLegalAccepted}
              />
            ) : null}
          </div>
        ) : null}

        {step === 2 ? (
          <>
            <input type="hidden" name="firstName" value={values.firstName} />
            <input type="hidden" name="lastName" value={values.lastName} />
            <input type="hidden" name="role" value={values.role} />
            <input type="hidden" name="clinicName" value={values.clinicName} />
            <input
              type="hidden"
              name="grammaticalGender"
              value={values.grammaticalGender}
            />
            <input
              type="hidden"
              name="avatarUrl"
              value={values.avatarUrl ?? ""}
            />
            {requiresLegalAcceptance && legalAccepted ? (
              <input type="hidden" name="legalAccepted" value="true" />
            ) : null}
          </>
        ) : null}
      </WizardShell>
    </form>
  );
}
