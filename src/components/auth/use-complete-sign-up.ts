"use client";

import { useAuth, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { completeSignUpSchema } from "@/validation/schemas";

type CompleteSignUpValues = z.infer<ReturnType<typeof completeSignUpSchema>>;

export function useCompleteSignUp() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();
  const requiresLegalAcceptance = signUp.missingFields.includes("legal_accepted");
  const form = useForm<CompleteSignUpValues>({
    resolver: zodResolver(completeSignUpSchema(requiresLegalAcceptance)),
    values: {
      firstName: signUp.firstName ?? "",
      lastName: signUp.lastName ?? "",
      legalAccepted: false,
    },
    resetOptions: { keepDirtyValues: true },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  function showError(message: string) {
    form.setError("root", { message });
    toast.error(message);
  }

  async function handleSubmit(values: CompleteSignUpValues) {
    form.clearErrors("root");

    try {
      if (signUp.status !== "complete") {
        const { error } = await signUp.update({
          firstName: values.firstName,
          lastName: values.lastName,
          ...(requiresLegalAcceptance && { legalAccepted: values.legalAccepted }),
        });

        if (error) {
          showError(error.message ?? "No se pudo completar el registro");
          return;
        }
      }

      if (signUp.status !== "complete") {
        showError("Quedan requisitos pendientes. Vuelve a iniciar sesión para completar el registro.");
        return;
      }

      const { error } = await signUp.finalize({
        navigate: async ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            showError("Tu cuenta requiere un paso adicional. Vuelve a iniciar sesión para continuar.");
            return;
          }

          const url = decorateUrl("/");

          if (url.startsWith("http")) {
            window.location.href = url;
            return;
          }

          router.replace(url);
        },
      });

      if (error) {
        showError(error.message ?? "No se pudo iniciar sesión");
      }
    } catch {
      showError("No se pudo completar el registro. Inténtalo de nuevo.");
    }
  }

  return {
    form,
    clerkErrors: errors,
    handleSubmit: form.handleSubmit(handleSubmit),
    requiresLegalAcceptance,
    isLoading: !isLoaded || isSignedIn || !signUp.id,
    isSubmitting: form.formState.isSubmitting || fetchStatus === "fetching",
  };
}
