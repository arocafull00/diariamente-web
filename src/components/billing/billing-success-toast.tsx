"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function BillingSuccessToast() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("suscripcion") !== "ok") {
      return;
    }

    toast.success("Suscripción activada. Gracias por confiar en DiariaMente.");
    router.replace(window.location.pathname);
  }, [router]);

  return null;
}
