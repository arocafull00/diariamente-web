"use client";

import { FileBraces, FileCheck, FileText, History, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

import { SettingsGroup } from "@/components/profile/settings-group";
import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import type { UserRole } from "@/db/schema";
import { getDateKey } from "@/lib/dates";
import { logger } from "@/lib/logger";
import {
  ACCESS_LOG_PATH,
  DATA_EXPORT_PDF_PATH,
  PRIVACY_POLICY_PATH,
} from "@/lib/privacy";
import { exportMyData } from "@/server/actions/privacy";

type SettingsPrivacyGroupProps = {
  role: UserRole;
};

export function SettingsPrivacyGroup({ role }: SettingsPrivacyGroupProps) {
  const [exportPending, startExportTransition] = useTransition();

  function handleExportJson() {
    startExportTransition(async () => {
      try {
        const data = await exportMyData();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `diariamente-mis-datos-${getDateKey(new Date())}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        logger.error("privacy.data_export_failed", error);
        toast.error("No se pudieron descargar tus datos");
      }
    });
  }

  return (
    <SettingsGroup title="Privacidad">
      {role === "patient" ? (
        <Link
          href={ACCESS_LOG_PATH}
          data-slot="settings-row"
          className={settingsRowClassName}
        >
          <SettingsRowContent
            icon={History}
            tone="blue"
            title="Historial de accesos"
            description="Cuándo ha visto tu profesional cada registro."
          />
        </Link>
      ) : null}
      <button
        type="button"
        data-slot="settings-row"
        className={settingsRowClassName}
        disabled={exportPending}
        onClick={handleExportJson}
      >
        <SettingsRowContent
          icon={FileBraces}
          tone="primary"
          title={exportPending ? "Preparando..." : "Descargar mis datos (JSON)"}
          description="Una copia completa de tus datos en formato portable."
          loading={exportPending}
        />
      </button>
      <Link
        href={DATA_EXPORT_PDF_PATH}
        prefetch={false}
        data-slot="settings-row"
        className={settingsRowClassName}
      >
        <SettingsRowContent
          icon={FileText}
          tone="primary"
          title="Descargar mis datos (PDF)"
          description="Una versión legible para guardar o imprimir."
        />
      </Link>
      <Link
        href={PRIVACY_POLICY_PATH}
        data-slot="settings-row"
        className={settingsRowClassName}
      >
        <SettingsRowContent
          icon={ShieldCheck}
          tone="green"
          title="Política de privacidad"
          description="Qué datos guardamos, durante cuánto tiempo y tus derechos."
        />
      </Link>
      <Link
        href="/terminos"
        data-slot="settings-row"
        className={settingsRowClassName}
      >
        <SettingsRowContent
          icon={FileCheck}
          tone="primary"
          title="Términos de servicio"
          description="Condiciones de uso para pacientes y profesionales."
        />
      </Link>
    </SettingsGroup>
  );
}
