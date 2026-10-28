"use client";

import { unlock } from "cuelume";
import { Volume2 } from "lucide-react";

import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import { Switch } from "@/components/ui/switch";
import { useSoundStore } from "@/stores/sound-store";

export function SettingsSoundRow() {
  const enabled = useSoundStore((state) => state.enabled);
  const setEnabled = useSoundStore((state) => state.setEnabled);

  function handleCheckedChange(checked: boolean) {
    setEnabled(checked);

    if (checked) {
      void unlock();
    }
  }

  return (
    <label
      htmlFor="sound"
      data-slot="settings-row"
      className={settingsRowClassName}
    >
      <SettingsRowContent
        icon={Volume2}
        tone="blue"
        title="Sonido"
        description="Sonidos suaves al tocar botones y guardar registros."
        trailing={
          <Switch
            id="sound"
            checked={enabled}
            onCheckedChange={handleCheckedChange}
          />
        }
      />
    </label>
  );
}
