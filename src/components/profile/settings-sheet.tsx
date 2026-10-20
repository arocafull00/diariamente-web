"use client";

import { Bell, LoaderCircle, Settings, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { PwaInstallButton } from "@/components/pwa/pwa-install-button";
import { PushSubscribeButton } from "@/components/pwa/push-subscribe-button";
import { SettingsGrammaticalGenderRow } from "@/components/profile/settings-grammatical-gender-row";
import { SettingsGroup } from "@/components/profile/settings-group";
import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import { SettingsSignOutDialog } from "@/components/profile/settings-sign-out-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import type { GrammaticalGender, UserRole } from "@/db/schema";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { deleteAccount } from "@/server/actions/onboarding";
import { saveReminderSettings } from "@/server/actions/reminders";

type SettingsSheetProps = {
  role: UserRole;
  remindersEnabled: boolean;
  grammaticalGender: GrammaticalGender;
};

export function SettingsSheet({
  role,
  remindersEnabled,
  grammaticalGender,
}: SettingsSheetProps) {
  const router = useRouter();
  const { installed, loading, handleInstall } = usePwaInstall();
  const [open, setOpen] = useState(false);
  const [, startSaveTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [enabled, setEnabled] = useState(remindersEnabled);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setEnabled(remindersEnabled);
    }

    setOpen(nextOpen);
  }

  function handleEnabledChange(checked: boolean) {
    setEnabled(checked);

    startSaveTransition(async () => {
      const result = await saveReminderSettings({ enabled: checked });

      if (result.error) {
        toast.error(result.error);
        setEnabled(remindersEnabled);
        return;
      }

      router.refresh();
    });
  }

  function handleDeleteAccount() {
    startDeleteTransition(async () => {
      const result = await deleteAccount();

      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent active:scale-95"
        aria-label="Ajustes"
      >
        <Settings className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex flex-col gap-0 bg-background sm:max-w-md"
      >
        <SheetHeader className="px-5 pt-6 pb-4">
          <SheetTitle className="text-2xl font-bold tracking-tight">
            Ajustes
          </SheetTitle>
          <SheetDescription>
            {role === "patient"
              ? "Gestiona recordatorios, notificaciones, sesión y cuenta."
              : "Gestiona tu sesión y cuenta."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6">
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
                  description="Un aviso a las 21:00 para registrar tu día."
                  trailing={
                    <Switch
                      id="reminders"
                      checked={enabled}
                      onCheckedChange={handleEnabledChange}
                    />
                  }
                />
              </label>
            ) : null}
            <PushSubscribeButton />
          </SettingsGroup>

          <SettingsGroup title="Cuenta">
            <SettingsSignOutDialog />
            <AlertDialog>
              <AlertDialogTrigger
                data-slot="settings-row"
                className={settingsRowClassName}
              >
                <SettingsRowContent
                  icon={Trash2}
                  tone="destructive"
                  title="Eliminar cuenta"
                  description="Borra tus datos de forma permanente."
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar tu cuenta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminarán todos tus
                    datos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={deletePending}
                    onClick={handleDeleteAccount}
                  >
                    {deletePending ? (
                      <LoaderCircle
                        className="animate-spin"
                        data-icon="inline-start"
                        aria-hidden="true"
                      />
                    ) : (
                      <Trash2 data-icon="inline-start" aria-hidden="true" />
                    )}
                    {deletePending ? "Eliminando..." : "Eliminar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SettingsGroup>

          <PwaInstallButton
            installed={installed}
            loading={loading}
            onInstall={handleInstall}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
