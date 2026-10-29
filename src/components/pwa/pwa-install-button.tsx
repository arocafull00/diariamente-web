"use client";

import { Smartphone } from "lucide-react";

import { SettingsGroup } from "@/components/profile/settings-group";
import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import { PwaInstallGuide } from "@/components/pwa/pwa-install-guide";
import { usePwaInstall } from "@/hooks/use-pwa-install";

export function PwaInstallButton() {
  const { installed, loading, handleInstall, guideOpen, setGuideOpen, platform } =
    usePwaInstall();

  return (
    <SettingsGroup title="Aplicación">
      <button
        type="button"
        data-cuelume-tap=""
        data-slot="settings-row"
        className={settingsRowClassName}
        aria-disabled={installed || loading}
        disabled={loading}
        onClick={installed ? undefined : handleInstall}
      >
        <SettingsRowContent
          icon={Smartphone}
          tone="green"
          title={
            installed ? "Ya instalada" : loading ? "Instalando..." : "Descargar app"
          }
          description="Añade Diariamente a tu pantalla de inicio."
          loading={loading}
        />
      </button>
      <PwaInstallGuide
        open={guideOpen}
        onOpenChange={setGuideOpen}
        platform={platform}
      />
    </SettingsGroup>
  );
}
