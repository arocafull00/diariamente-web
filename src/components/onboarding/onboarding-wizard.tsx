"use client";

import { ArrowLeft, ArrowRight, HeartPulse, LoaderCircle, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";

import { OnboardingPersonalStep } from "@/components/onboarding/onboarding-personal-step";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { OnboardingReviewStep } from "@/components/onboarding/onboarding-review-step";
import { OnboardingRoleStep } from "@/components/onboarding/onboarding-role-step";
import { Button } from "@/components/ui/button";
import { useOnboardingWizard } from "@/components/onboarding/use-onboarding-wizard";

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
    <div className="w-full overflow-hidden rounded-2xl bg-card shadow-md">
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="size-5" aria-hidden="true" />
          </span>
          <p className="text-lg font-bold tracking-tight text-primary">DiariaMente</p>
        </div>
        <div className="hidden items-center gap-2 text-sm font-medium text-foreground/65 sm:flex">
          <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
          Configuración segura
        </div>
      </header>

      <div className="px-5 pt-6 sm:px-8 sm:pt-8">
        <OnboardingProgress step={step} />
      </div>
      <form
        action={formAction}
        noValidate
        className="pt-9 sm:pt-12"
        onSubmit={(event) => {
          if (step < 2) {
            event.preventDefault();
            void goForward();
          }
        }}
      >
        <div className="px-5 sm:px-8">
          <div className="mb-7 max-w-xl">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-balance text-2xl font-bold tracking-tight outline-none sm:text-3xl"
            >
              {STEP_CONTENT[step].title}
            </h1>
            <p className="mt-2 max-w-lg text-pretty text-base leading-7 text-foreground/70">
              {STEP_CONTENT[step].description}
            </p>
          </div>

          {step === 0 ? (
            <OnboardingPersonalStep
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

          {state.error && step === 2 ? (
            <p
              role="alert"
              aria-live="polite"
              className="mt-5 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive"
            >
              {state.error}
            </p>
          ) : null}
        </div>

        {step === 2 ? (
          <>
            <input type="hidden" name="firstName" value={values.firstName} />
            <input type="hidden" name="lastName" value={values.lastName} />
            <input type="hidden" name="role" value={values.role} />
          </>
        ) : null}

        <div className="mt-9 flex items-center justify-between gap-3 border-t border-border bg-muted/45 px-5 py-4 sm:px-8 sm:py-5">
          {step > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-11 px-4"
              disabled={pending}
              onClick={goBack}
            >
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Atrás
            </Button>
          ) : (
            <span />
          )}

          {step < 2 ? (
            <Button
              type="submit"
              size="lg"
              className={
                step === 0
                  ? "h-11 w-full px-5 sm:w-auto sm:min-w-36"
                  : "h-11 flex-1 px-5 sm:flex-none sm:min-w-36"
              }
            >
              Continuar
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              className="h-11 flex-1 px-5 sm:flex-none sm:min-w-44"
              disabled={pending}
            >
              {pending ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : null}
              {pending ? "Creando perfil..." : "Crear mi perfil"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
