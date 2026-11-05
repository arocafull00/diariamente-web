"use client";

import { BellRing } from "lucide-react";
import { toast } from "sonner";

import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import { Switch } from "@/components/ui/switch";
import { usePushSubscription } from "@/hooks/use-push-subscription";

export function PushSubscribeButton() {
  const { available, loading, subscribed, subscribe, unsubscribe } =
    usePushSubscription();

  async function handleCheckedChange(checked: boolean) {
    if (checked) {
      if (await subscribe()) {
        toast.success("¡Notificaciones activadas!");
      }
      return;
    }

    if (await unsubscribe()) {
      toast.success("Notificaciones desactivadas en este dispositivo");
    }
  }

  if (!available) {
    return null;
  }

  return (
    <label
      htmlFor="push-notifications"
      data-slot="settings-row"
      className={settingsRowClassName}
    >
      <SettingsRowContent
        icon={BellRing}
        tone="blue"
        title="Notificaciones"
        description={
          subscribed
            ? "Activadas en este dispositivo."
            : "Recibe avisos en este dispositivo."
        }
        loading={loading}
        trailing={
          <Switch
            id="push-notifications"
            checked={subscribed}
            disabled={loading}
            onCheckedChange={handleCheckedChange}
          />
        }
      />
    </label>
  );
}
