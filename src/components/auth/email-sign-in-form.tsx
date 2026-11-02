"use client";

import { EmailPasswordForm } from "@/components/auth/email-password-form";
import { useEmailSignIn } from "@/components/auth/use-email-sign-in";
import { VerificationCodeForm } from "@/components/auth/verification-code-form";

export function EmailSignInForm() {
  const signIn = useEmailSignIn();

  if (signIn.step === "code") {
    return (
      <VerificationCodeForm
        form={signIn.codeForm}
        email={signIn.email}
        onSubmit={signIn.submitCode}
        onResend={signIn.resendCode}
        onBack={signIn.goBack}
      />
    );
  }

  return (
    <EmailPasswordForm
      form={signIn.credentialsForm}
      onSubmit={signIn.submitCredentials}
      submitLabel="Iniciar sesión"
      pendingLabel="Entrando..."
      passwordAutoComplete="current-password"
    />
  );
}
