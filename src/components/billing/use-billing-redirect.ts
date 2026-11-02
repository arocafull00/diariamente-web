"use client";

import { useTransition } from "react";
import { toast } from "sonner";

type BillingRedirectResult = { url?: string; error?: string };

export function useBillingRedirect(run: () => Promise<BillingRedirectResult>) {
  const [pending, startTransition] = useTransition();

  function redirect() {
    startTransition(async () => {
      const result = await run();

      if (result.error || !result.url) {
        toast.error(result.error ?? "Uy, algo ha fallado. Inténtalo otra vez");
        return;
      }

      window.location.assign(result.url);
    });
  }

  return { pending, redirect };
}
