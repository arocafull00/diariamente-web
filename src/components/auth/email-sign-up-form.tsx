"use client";

import { EmailPasswordForm } from "@/components/auth/email-password-form";
import { useEmailSignUp } from "@/components/auth/use-email-sign-up";

export function EmailSignUpForm() {
  const signUp = useEmailSignUp();

  return (
    <EmailPasswordForm
      form={signUp.credentialsForm}
      onSubmit={signUp.submitCredentials}
      submitLabel="Crear cuenta"
      pendingLabel="Creando cuenta..."
      passwordAutoComplete="new-password"
    />
  );
}
