"use client";

import { useState } from "react";
import { toast } from "sonner";

import { logger } from "@/lib/logger";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

const SUBSCRIBE_ERROR_MESSAGES: Record<string, string> = {
  NotAllowedError: "Has bloqueado las notificaciones. Actívalas en los ajustes del navegador",
  AbortError:
    "Tu navegador está bloqueando las notificaciones. Échale un ojo a su configuración de privacidad.",
  InvalidStateError:
    "Ahora mismo no podemos activar las notificaciones. Recarga la página y vuelve a probar.",
  InvalidAccessError: "Uy, algo falla con las notificaciones. Inténtalo más tarde",
};

async function createSubscription(
  registration: ServiceWorkerRegistration,
  publicKey: string,
) {
  const options = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  };

  try {
    return await registration.pushManager.subscribe(options);
  } catch (error) {
    logger.warn("push.subscribe.retrying", {
      errorName: error instanceof Error ? error.name : null,
    });
    const existing = await registration.pushManager.getSubscription();

    if (!existing) {
      throw error;
    }

    await existing.unsubscribe();
    return registration.pushManager.subscribe(options);
  }
}

export function usePushSubscription() {
  const [loading, setLoading] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  async function subscribe() {
    if (!publicKey) {
      toast.error("Las notificaciones aún no están disponibles");
      return false;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error("Tu navegador no admite notificaciones");
      return false;
    }

    setLoading(true);

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast.error("Has bloqueado las notificaciones. Actívalas en los ajustes del navegador");
        return false;
      }

      if (!(await navigator.serviceWorker.getRegistration())) {
        toast.error("Ahora mismo no podemos activar las notificaciones. Recarga la página y vuelve a probar.");
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await createSubscription(registration, publicKey);

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      if (!response.ok) {
        logger.error(
          "push.subscribe.request_failed",
          new Error(`Push subscribe responded ${response.status}`),
          { status: response.status },
        );
        toast.error("Uy, no hemos podido activar las notificaciones");
        return false;
      }

      return true;
    } catch (error) {
      logger.error("push.subscribe_failed", error);
      toast.error(
        (error instanceof DOMException && SUBSCRIBE_ERROR_MESSAGES[error.name]) ||
          "Uy, no hemos podido activar las notificaciones",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { available: Boolean(publicKey), loading, subscribe };
}
