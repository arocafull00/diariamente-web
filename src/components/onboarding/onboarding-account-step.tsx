"use client";

import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";

import { AuthDivider } from "@/components/auth/auth-divider";
import type { EmailPasswordValues } from "@/components/auth/auth-types";
import { EmailPasswordForm } from "@/components/auth/email-password-form";
import { GoogleSignInForm } from "@/components/auth/google-sign-in-form";
import { OnboardingLegalAcceptance } from "@/components/onboarding/onboarding-legal-acceptance";
import { Button } from "@/components/ui/button";

type OnboardingAccountStepProps = {
  hasAccount: boolean;
  requiresLegal: boolean;
  legalAccepted: boolean;
  legalError?: string;
  onLegalChange: (checked: boolean) => void;
  credentialsForm: UseFormReturn<EmailPasswordValues>;
  onSubmitCredentials: () => void;
  onGoogleStart: () => boolean;
  onUseAnotherEmail?: () => void;
  emailTaken: boolean;
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
  onUseAnotherEmail,
  emailTaken,
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
        {onUseAnotherEmail ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mx-auto flex text-muted-foreground"
            onClick={onUseAnotherEmail}
          >
            Usar otro correo
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {emailTaken ? (
        <p className="rounded-2xl bg-mood-hp-soft px-4 py-3 text-sm font-semibold text-mood-hp-strong">
          Ya tienes cuenta con este correo, pero esa contraseña no es la suya. Revísala y entra.
        </p>
      ) : null}
      <EmailPasswordForm
        form={credentialsForm}
        onSubmit={onSubmitCredentials}
        submitLabel={emailTaken ? "Iniciar sesión con esta cuenta" : "Crear cuenta"}
        pendingLabel={emailTaken ? "Entrando..." : "Creando cuenta..."}
        passwordAutoComplete="new-password"
        beforeSubmit={legal}
      />
      <AuthDivider />
      <GoogleSignInForm redirectUrl="/onboarding" onBeforeRedirect={onGoogleStart} />
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
