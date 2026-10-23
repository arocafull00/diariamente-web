"use client";

import { useState } from "react";
import { toast } from "sonner";

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

export function usePushSubscription() {
  const [loading, setLoading] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  async function subscribe() {
    if (!publicKey) {
      toast.error("Push no configurado");
      return false;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error("Tu navegador no soporta notificaciones push");
      return false;
    }

    setLoading(true);

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast.error("Permiso de notificaciones denegado");
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      if (!response.ok) {
        toast.error("No se pudo guardar la suscripción");
        return false;
      }

      return true;
    } catch {
      toast.error("Error al activar notificaciones");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { available: Boolean(publicKey), loading, subscribe };
}
