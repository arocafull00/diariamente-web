"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { logger } from "@/lib/logger";
import { deletePushSubscription } from "@/server/actions/reminders";

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

async function getCurrentSubscription() {
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    Notification.permission !== "granted"
  ) {
    return null;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  return (await registration?.pushManager.getSubscription()) ?? null;
}

export function usePushSubscription() {
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    let cancelled = false;

    getCurrentSubscription()
      .then((subscription) => {
        if (!cancelled) {
          setSubscribed(Boolean(subscription));
        }
      })
      .catch((error: unknown) => {
        logger.warn("push.subscription_check_failed", {
          errorName: error instanceof Error ? error.name : null,
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
        await navigator.serviceWorker.register("/sw.js");
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

      setSubscribed(true);
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

  async function unsubscribe() {
    setLoading(true);

    try {
      const subscription = await getCurrentSubscription();

      if (subscription) {
        await deletePushSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }

      setSubscribed(false);
      return true;
    } catch (error) {
      logger.error("push.unsubscribe_failed", error);
      toast.error("Uy, no hemos podido desactivar las notificaciones");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { available: Boolean(publicKey), loading, subscribed, subscribe, unsubscribe };
}
