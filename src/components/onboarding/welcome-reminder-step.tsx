"use client";

import { Bell, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { SettingsGroup } from "@/components/profile/settings-group";
import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import { usePushSubscription } from "@/hooks/use-push-subscription";
import { saveReminderSettings } from "@/server/actions/reminders";

type WelcomeReminderStepProps = {
  remindersEnabled: boolean;
};

export function WelcomeReminderStep({
  remindersEnabled,
}: WelcomeReminderStepProps) {
  const router = useRouter();
  const { loading: subscribing, subscribe } = usePushSubscription();
  const [saving, startSaveTransition] = useTransition();
  const [enabled, setEnabled] = useState(remindersEnabled);
  const loading = subscribing || saving;

  async function handleActivate() {
    if (!(await subscribe())) {
      return;
    }

    startSaveTransition(async () => {
      const result = await saveReminderSettings({ enabled: true });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setEnabled(true);
      toast.success("Recordatorio activado");
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <SettingsGroup title="Recordatorio diario">
        <button
          type="button"
          data-slot="settings-row"
          className={settingsRowClassName}
          aria-disabled={enabled || loading}
          disabled={loading}
          onClick={enabled ? undefined : handleActivate}
        >
          <SettingsRowContent
            icon={Bell}
            tone="yellow"
            title={
              enabled
                ? "Recordatorio activado"
                : loading
                  ? "Activando..."
                  : "Activar recordatorio"
            }
            description="Recibirás un aviso cada día a las 21:00 en este dispositivo."
            loading={loading}
            trailing={
              enabled ? (
                <Check className="size-5 shrink-0 text-primary" aria-hidden="true" />
              ) : undefined
            }
          />
        </button>
      </SettingsGroup>
      <p className="px-1 text-sm text-foreground/65">
        Te pediremos permiso para mostrar notificaciones. Si prefieres no
        activarlo ahora, puedes continuar.
      </p>
    </div>
  );
}
