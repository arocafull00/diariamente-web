"use client";

import { EmailPasswordForm } from "@/components/auth/email-password-form";
import { useEmailSignUp } from "@/components/auth/use-email-sign-up";
import { VerificationCodeForm } from "@/components/auth/verification-code-form";

export function EmailSignUpForm() {
  const signUp = useEmailSignUp();

  if (signUp.step === "code") {
    return (
      <VerificationCodeForm
        form={signUp.codeForm}
        email={signUp.email}
        onSubmit={signUp.submitCode}
        onResend={signUp.resendCode}
        onBack={signUp.goBack}
      />
    );
  }

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
