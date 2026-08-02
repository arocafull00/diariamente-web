"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";

import { OnboardingPersonalStep } from "@/components/onboarding/onboarding-personal-step";
import { OnboardingReviewStep } from "@/components/onboarding/onboarding-review-step";
import { OnboardingRoleStep } from "@/components/onboarding/onboarding-role-step";
import { useOnboardingWizard } from "@/components/onboarding/use-onboarding-wizard";
import { WizardFooter } from "@/components/wizard/wizard-footer";
import { WizardShell } from "@/components/wizard/wizard-shell";

const STEP_LABELS = ["Tus datos", "Tu perfil", "Confirmación"] as const;

const STEP_CONTENT = [
  {
    title: "Empecemos por conocerte",
    description: "Usaremos tu nombre para personalizar tu experiencia en DiariaMente.",
  },
  {
    title: "¿Cómo vas a usar DiariaMente?",
    description: "Tu elección adapta las herramientas y la navegación a tus necesidades.",
  },
  {
    title: "Todo listo para empezar",
    description: "Revisa tus datos antes de crear tu espacio personal.",
  },
] as const;

export function OnboardingWizard() {
  const { form, formAction, goBack, goForward, pending, state, step } =
    useOnboardingWizard();
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
        if (step < 2) {
          event.preventDefault();
          void goForward();
        }
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
              src="/logo.png"
              alt=""
              width={44}
              height={44}
              priority
              className="size-11 object-contain"
            />
            <p className="text-lg font-bold tracking-tight text-primary">DiariaMente</p>
          </header>
        }
        footer={
          <WizardFooter
            showBack={step > 0}
            onBack={goBack}
            backDisabled={pending}
            primaryLabel={
              step < 2 ? "Continuar" : pending ? "Creando perfil..." : "Crear mi perfil"
            }
            primaryType="submit"
            primaryDisabled={step === 2 && pending}
            primaryPending={step === 2 && pending}
            primaryIcon={step < 2 ? "continue" : "create"}
          />
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
              />
            )}
          />
        ) : null}

        {step === 2 ? <OnboardingReviewStep values={values} /> : null}

        {step === 2 ? (
          <>
            <input type="hidden" name="firstName" value={values.firstName} />
            <input type="hidden" name="lastName" value={values.lastName} />
            <input type="hidden" name="role" value={values.role} />
            <input
              type="hidden"
              name="avatarUrl"
              value={values.avatarUrl ?? ""}
            />
          </>
        ) : null}
      </WizardShell>
    </form>
  );
}
