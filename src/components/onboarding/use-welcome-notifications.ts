"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { usePushSubscription } from "@/hooks/use-push-subscription";
import { logger } from "@/lib/logger";
import { saveReminderSettings } from "@/server/actions/reminders";

export function useWelcomeNotifications(role: "patient" | "psychologist") {
  const { loading: subscribing, subscribe } = usePushSubscription();
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || Notification.permission !== "granted") {
      return;
    }

    navigator.serviceWorker
      .getRegistration()
      .then((registration) => registration?.pushManager.getSubscription() ?? null)
      .then((subscription) => setEnabled(subscription !== null))
      .catch((error: unknown) => {
        logger.warn("push.subscription_check_failed", {
          errorMessage: error instanceof Error ? error.message : String(error),
        });
      });
  }, []);

  async function activate() {
    if (!(await subscribe())) {
      return false;
    }

    if (role === "patient") {
      setSaving(true);
      const result = await saveReminderSettings({ enabled: true });
      setSaving(false);

      if (result.error) {
        toast.error(result.error);
        return false;
      }
    }

    setEnabled(true);
    toast.success("Notificaciones activadas");
    return true;
  }

  return { activate, enabled, loading: subscribing || saving };
}
