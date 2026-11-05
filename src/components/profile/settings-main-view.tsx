"use client";

import { Bell, CreditCard, ShieldCheck } from "lucide-react";

import { PwaInstallButton } from "@/components/pwa/pwa-install-button";
import { PushSubscribeButton } from "@/components/pwa/push-subscribe-button";
import { SettingsGrammaticalGenderRow } from "@/components/profile/settings-grammatical-gender-row";
import { SettingsGroup } from "@/components/profile/settings-group";
import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import { SettingsSignOutDialog } from "@/components/profile/settings-sign-out-dialog";
import { SettingsSoundRow } from "@/components/profile/settings-sound-row";
import { Switch } from "@/components/ui/switch";
import type { GrammaticalGender, UserRole } from "@/db/schema";

type SettingsMainViewProps = {
  role: UserRole;
  grammaticalGender: GrammaticalGender;
  enabled: boolean;
  onEnabledChange: (checked: boolean) => void;
  onPrivacy: () => void;
  onSubscription?: () => void;
};

export function SettingsMainView({
  role,
  grammaticalGender,
  enabled,
  onEnabledChange,
  onPrivacy,
  onSubscription,
}: SettingsMainViewProps) {
  return (
    <>
      <SettingsGroup title="Preferencias">
        <SettingsGrammaticalGenderRow
          key={grammaticalGender}
          grammaticalGender={grammaticalGender}
        />
        {role === "patient" ? (
          <label
            htmlFor="reminders"
            data-slot="settings-row"
            className={settingsRowClassName}
          >
            <SettingsRowContent
              icon={Bell}
              tone="yellow"
              title="Recordatorio diario"
              description="Un toque a las 21:00 para contar qué tal tu día."
              trailing={
                <Switch
                  id="reminders"
                  checked={enabled}
                  onCheckedChange={onEnabledChange}
                />
              }
            />
          </label>
        ) : null}
        <SettingsSoundRow />
        <PushSubscribeButton />
      </SettingsGroup>

      <SettingsGroup title="Privacidad y cuenta">
        <button
          type="button"
          onClick={onPrivacy}
          data-cuelume-tap="type"
          data-slot="settings-row"
          className={settingsRowClassName}
        >
          <SettingsRowContent
            icon={ShieldCheck}
            tone="blue"
            title="Privacidad y cuenta"
            description="Gestiona tus datos o elimina tu cuenta."
          />
        </button>
      </SettingsGroup>

      {onSubscription ? (
        <SettingsGroup title="Suscripción">
          <button
            type="button"
            onClick={onSubscription}
            data-cuelume-tap="type"
            data-slot="settings-row"
            className={settingsRowClassName}
          >
            <SettingsRowContent
              icon={CreditCard}
              tone="green"
              title="Suscripción"
              description="Consulta y gestiona tu plan."
            />
          </button>
        </SettingsGroup>
      ) : null}

      <PwaInstallButton />

      <div className="mt-auto">
        <SettingsGroup title="Cuenta">
          <SettingsSignOutDialog />
        </SettingsGroup>
      </div>
    </>
  );
}
