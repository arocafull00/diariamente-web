"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          void registration.unregister();
        }
      });
      return;
    }

    void navigator.serviceWorker.register("/sw.js");

    function handleMessage(event: MessageEvent) {
      if (event.data?.type !== "app-updated") {
        return;
      }

      toast("Hay una nueva versión disponible", {
        id: "app-updated",
        duration: Infinity,
        action: {
          label: "Actualizar",
          onClick: () => window.location.reload(),
        },
      });
    }

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  return null;
}
