"use client";

import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";

import { AuthDivider } from "@/components/auth/auth-divider";
import type { EmailPasswordValues } from "@/components/auth/auth-types";
import { EmailPasswordForm } from "@/components/auth/email-password-form";
import { GoogleSignInForm } from "@/components/auth/google-sign-in-form";
import { OnboardingLegalAcceptance } from "@/components/onboarding/onboarding-legal-acceptance";

type OnboardingAccountStepProps = {
  hasAccount: boolean;
  requiresLegal: boolean;
  legalAccepted: boolean;
  legalError?: string;
  onLegalChange: (checked: boolean) => void;
  credentialsForm: UseFormReturn<EmailPasswordValues>;
  onSubmitCredentials: () => void;
  onGoogleStart: () => boolean;
};

export function OnboardingAccountStep({
  hasAccount,
  requiresLegal,
  legalAccepted,
  legalError,
  onLegalChange,
  credentialsForm,
  onSubmitCredentials,
  onGoogleStart,
}: OnboardingAccountStepProps) {
  const legal = requiresLegal ? (
    <OnboardingLegalAcceptance
      checked={legalAccepted}
      error={legalError}
      onChange={onLegalChange}
    />
  ) : null;

  if (hasAccount) {
    return (
      <div className="space-y-4">
        <p className="rounded-2xl bg-mood-lp-soft px-4 py-3 text-sm font-semibold text-mood-lp-strong">
          Tu cuenta ya está creada. Solo falta guardar tu perfil.
        </p>
        {legal}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {legal}
      <GoogleSignInForm redirectUrl="/onboarding" onBeforeRedirect={onGoogleStart} />
      <AuthDivider />
      <EmailPasswordForm
        form={credentialsForm}
        onSubmit={onSubmitCredentials}
        submitLabel="Crear cuenta"
        pendingLabel="Creando cuenta..."
        passwordAutoComplete="new-password"
      />
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
