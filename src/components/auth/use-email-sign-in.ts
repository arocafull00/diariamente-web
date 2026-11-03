"use client";

import { useSignIn } from "@clerk/nextjs";
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

const SIGN_IN_ERROR = "Uy, no hemos podido iniciar sesión";

export function useEmailSignIn(defaultEmail?: string) {
  const router = useRouter();
  const { signIn } = useSignIn();
  const [step, setStep] = useState<EmailAuthStep>("credentials");
  const credentialsForm = useForm<EmailPasswordValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: defaultEmail ?? "", password: "" },
  });
  const codeForm = useForm<VerificationCodeValues>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: { code: "" },
  });

  async function finalize() {
    const { error } = await signIn.finalize({
      navigate: async ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          return;
        }

        const url = decorateUrl("/");

        if (url.startsWith("http")) {
          window.location.href = url;
          return;
        }

        router.push(url);
      },
    });

    if (error) {
      logger.error("auth.login.password_finalize_failed", error);
      toast.error(getAuthErrorMessage(error, SIGN_IN_ERROR));
    }
  }

  async function sendCode() {
    const { error } = await signIn.mfa.sendEmailCode();

    if (error) {
      logger.error("auth.login.client_trust_send_failed", error);
      toast.error(getAuthErrorMessage(error, "Uy, no hemos podido enviarte el código"));
      return false;
    }

    return true;
  }

  const submitCredentials = credentialsForm.handleSubmit(
    async ({ email, password }) => {
      if (signIn.id) {
        await signIn.reset();
      }

      const { error } = await signIn.password({ emailAddress: email, password });

      if (error) {
        toast.error(getAuthErrorMessage(error, SIGN_IN_ERROR));
        return;
      }

      if (signIn.status === "complete") {
        await finalize();
        return;
      }

      const canUseEmailCode = signIn.supportedSecondFactors.some(
        (factor) => factor.strategy === "email_code",
      );

      if (
        (signIn.status === "needs_client_trust" ||
          signIn.status === "needs_second_factor") &&
        canUseEmailCode
      ) {
        if (await sendCode()) {
          codeForm.reset();
          setStep("code");
        }
        return;
      }

      logger.error(
        "auth.login.password_unresolved",
        new Error("Password sign-in ended in an unsupported status"),
        { signInStatus: signIn.status },
      );
      toast.error(SIGN_IN_ERROR);
    },
  );

  const submitCode = codeForm.handleSubmit(async ({ code }) => {
    const { error } = await signIn.mfa.verifyEmailCode({ code });

    if (error) {
      toast.error(getAuthErrorMessage(error, "Ese código no es el bueno. Revísalo"));
      return;
    }

    if (signIn.status !== "complete") {
      toast.error(SIGN_IN_ERROR);
      return;
    }

    await finalize();
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
