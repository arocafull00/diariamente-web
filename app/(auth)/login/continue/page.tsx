"use client";

import { ArrowRight, CircleAlert, LoaderCircle, UserRound } from "lucide-react";
import Link from "next/link";

import { CompleteSignUpHeader } from "@/components/auth/complete-sign-up-header";
import { useCompleteSignUp } from "@/components/auth/use-complete-sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRIVACY_POLICY_PATH } from "@/lib/privacy";

export default function LoginContinuePage() {
  const { form, handleSubmit, requiresLegalAcceptance, isLoading, isSubmitting, clerkErrors } =
    useCompleteSignUp();
  const { errors } = form.formState;
  const firstNameError = errors.firstName ?? clerkErrors.fields.firstName;
  const lastNameError = errors.lastName ?? clerkErrors.fields.lastName;
  const legalAcceptedError = errors.legalAccepted ?? clerkErrors.fields.legalAccepted;

  return (
    <div className="flex min-h-full flex-1 flex-col items-center px-6 py-8 sm:py-10">
      <div className="w-full max-w-sm">
        <CompleteSignUpHeader />
        <form onSubmit={handleSubmit} className="mt-8" noValidate aria-label="Completar registro">
          <fieldset disabled={isLoading || isSubmitting} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="firstName" className="font-semibold">Nombre</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground/55" aria-hidden="true" />
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  placeholder="Tu nombre"
                  className="h-12 bg-card pl-10 pr-3 placeholder:text-foreground/65"
                  required
                  aria-invalid={Boolean(firstNameError)}
                  aria-describedby={firstNameError ? "firstName-error" : undefined}
                  {...form.register("firstName")}
                />
              </div>
              {firstNameError ? (
                <p id="firstName-error" className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                  <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
                  {firstNameError.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="lastName" className="font-semibold">Apellidos</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground/55" aria-hidden="true" />
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  placeholder="Tus apellidos"
                  className="h-12 bg-card pl-10 pr-3 placeholder:text-foreground/65"
                  required
                  aria-invalid={Boolean(lastNameError)}
                  aria-describedby={lastNameError ? "lastName-error" : undefined}
                  {...form.register("lastName")}
                />
              </div>
              {lastNameError ? (
                <p id="lastName-error" className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                  <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
                  {lastNameError.message}
                </p>
              ) : null}
            </div>
            {requiresLegalAcceptance ? (
              <div className="space-y-2">
                <div className="flex items-start gap-3 rounded-2xl border border-transparent bg-secondary p-4 text-sm leading-6 transition-colors has-[:checked]:border-mood-lp-strong/30 has-[:checked]:bg-mood-lp-soft">
                  <input
                    id="legalAccepted"
                    type="checkbox"
                    required
                    aria-invalid={Boolean(legalAcceptedError)}
                    aria-describedby={legalAcceptedError ? "legalAccepted-error" : undefined}
                    className="mt-0.5 size-5 shrink-0 cursor-pointer accent-mood-lp-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    {...form.register("legalAccepted")}
                  />
                  <label htmlFor="legalAccepted" className="cursor-pointer">
                    Acepto los{" "}
                    <Link href="/terminos" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">
                      términos de servicio
                    </Link>{" "}
                    y la{" "}
                    <Link href={PRIVACY_POLICY_PATH} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">
                      política de privacidad
                    </Link>.
                  </label>
                </div>
                {legalAcceptedError ? (
                  <p id="legalAccepted-error" className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                    <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
                    {legalAcceptedError.message}
                  </p>
                ) : null}
              </div>
            ) : null}
            {errors.root ? (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2.5 text-sm font-medium text-destructive">
                {errors.root.message}
              </p>
            ) : null}
            <Button type="submit" size="lg" className="btn-raised-joy w-full rounded-2xl font-extrabold text-mood-foreground">
              {isSubmitting ? (
                <LoaderCircle className="motion-safe:animate-spin" aria-hidden="true" />
              ) : null}
              {isSubmitting ? "Creando cuenta..." : "Crear mi cuenta"}
              {!isSubmitting ? (
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              ) : null}
            </Button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
