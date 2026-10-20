"use client";

import { Smartphone } from "lucide-react";

import { SettingsGroup } from "@/components/profile/settings-group";
import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";

type PwaInstallButtonProps = {
  installed: boolean;
  loading: boolean;
  onInstall: () => Promise<void>;
};

export function PwaInstallButton({
  installed,
  loading,
  onInstall,
}: PwaInstallButtonProps) {
  return (
    <SettingsGroup title="Aplicación">
      <button
        type="button"
        data-slot="settings-row"
        className={settingsRowClassName}
        aria-disabled={installed || loading}
        disabled={loading}
        onClick={installed ? undefined : onInstall}
      >
        <SettingsRowContent
          icon={Smartphone}
          tone="green"
          title={
            installed ? "Ya instalada" : loading ? "Instalando..." : "Descargar app"
          }
          description="Añade DiariaMente a tu pantalla de inicio."
          loading={loading}
        />
      </button>
    </SettingsGroup>
  );
}
