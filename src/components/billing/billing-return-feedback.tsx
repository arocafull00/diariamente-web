"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function BillingReturnFeedback() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const result = url.searchParams.get("suscripcion");

    if (result !== "ok" && result !== "gestionar") {
      return;
    }

    if (result === "ok") {
      toast.success("¡Suscripción activada! Gracias por confiar en Diariamente.");
    }

    url.searchParams.delete("suscripcion");
    window.history.replaceState(null, "", url);
  }, []);

  return null;
}
