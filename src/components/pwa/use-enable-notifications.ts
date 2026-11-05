"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { UserRole } from "@/db/schema";
import { usePushSubscription } from "@/hooks/use-push-subscription";
import { saveReminderSettings } from "@/server/actions/reminders";

export function useEnableNotifications(role: UserRole) {
  const { loading: subscribing, subscribe } = usePushSubscription();
  const [saving, setSaving] = useState(false);

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

    toast.success("¡Notificaciones activadas!");
    return true;
  }

  return { activate, loading: subscribing || saving };
}
