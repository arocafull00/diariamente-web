"use client";

import { BellRing } from "lucide-react";
import { toast } from "sonner";

import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import { usePushSubscription } from "@/hooks/use-push-subscription";

export function PushSubscribeButton() {
  const { available, loading, subscribe } = usePushSubscription();

  async function handleSubscribe() {
    if (await subscribe()) {
      toast.success("Notificaciones activadas");
    }
  }

  if (!available) {
    return null;
  }

  return (
    <button
      type="button"
      data-cuelume-tap=""
      data-slot="settings-row"
      className={settingsRowClassName}
      disabled={loading}
      onClick={handleSubscribe}
    >
      <SettingsRowContent
        icon={BellRing}
        tone="blue"
        title={loading ? "Activando..." : "Notificaciones push"}
        description="Permite los avisos en este dispositivo."
        loading={loading}
      />
    </button>
  );
}
