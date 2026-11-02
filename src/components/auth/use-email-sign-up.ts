"use client";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { EmailPasswordValues } from "@/components/auth/auth-types";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { logger } from "@/lib/logger";
import { emailPasswordSchema } from "@/validation/schemas";

const SIGN_UP_ERROR = "Uy, no hemos podido crear tu cuenta";

export function useEmailSignUp() {
  const router = useRouter();
  const { signUp } = useSignUp();
  const credentialsForm = useForm<EmailPasswordValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: "", password: "" },
  });

  const submitCredentials = credentialsForm.handleSubmit(
    async ({ email, password }) => {
      const { error } = await signUp.create({ emailAddress: email, password });

      if (error) {
        toast.error(getAuthErrorMessage(error, SIGN_UP_ERROR));
        return;
      }

      if (signUp.status === "missing_requirements") {
        router.push("/onboarding");
        return;
      }

      if (signUp.status !== "complete") {
        logger.error(
          "auth.signup.password_unresolved",
          new Error("Password sign-up ended in an unsupported status"),
          { signUpStatus: signUp.status },
        );
        toast.error(SIGN_UP_ERROR);
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
    },
  );

  return { credentialsForm, submitCredentials };
}
