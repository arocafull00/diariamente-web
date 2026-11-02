"use client";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  EmailAuthStep,
  EmailPasswordValues,
  VerificationCodeValues,
} from "@/components/auth/auth-types";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { logger } from "@/lib/logger";
import {
  emailPasswordSchema,
  verificationCodeSchema,
} from "@/validation/schemas";

const SIGN_UP_ERROR = "Uy, no hemos podido crear tu cuenta";

export function useEmailSignUp() {
  const router = useRouter();
  const { signUp } = useSignUp();
  const [step, setStep] = useState<EmailAuthStep>("credentials");
  const credentialsForm = useForm<EmailPasswordValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: "", password: "" },
  });
  const codeForm = useForm<VerificationCodeValues>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: { code: "" },
  });

  async function sendCode() {
    const { error } = await signUp.verifications.sendEmailCode();

    if (error) {
      logger.error("auth.signup.email_code_send_failed", error);
      toast.error(getAuthErrorMessage(error, "Uy, no hemos podido enviarte el código"));
      return false;
    }

    return true;
  }

  const submitCredentials = credentialsForm.handleSubmit(
    async ({ email, password }) => {
      const { error } = await signUp.password({ emailAddress: email, password });

      if (error) {
        toast.error(getAuthErrorMessage(error, SIGN_UP_ERROR));
        return;
      }

      if (await sendCode()) {
        codeForm.reset();
        setStep("code");
      }
    },
  );

  const submitCode = codeForm.handleSubmit(async ({ code }) => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });

    if (error) {
      toast.error(getAuthErrorMessage(error, "Ese código no es el bueno. Revísalo"));
      return;
    }

    if (signUp.status !== "complete") {
      router.push("/onboarding");
      return;
    }

    const { error: finalizeError } = await signUp.finalize({
      navigate: async ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          return;
        }

        const url = decorateUrl("/onboarding");

        if (url.startsWith("http")) {
          window.location.href = url;
          return;
        }

        router.push(url);
      },
    });

    if (finalizeError) {
      logger.error("auth.signup.finalize_failed", finalizeError);
      toast.error(getAuthErrorMessage(finalizeError, SIGN_UP_ERROR));
    }
  });

  async function resendCode() {
    if (await sendCode()) {
      toast.success("¡Código nuevo en camino! Mira tu correo");
    }
  }

  return {
    step,
    email: credentialsForm.getValues("email"),
    credentialsForm,
    codeForm,
    submitCredentials,
    submitCode,
    resendCode,
    goBack: () => setStep("credentials"),
  };
}
