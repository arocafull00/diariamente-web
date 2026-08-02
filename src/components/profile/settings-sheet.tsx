"use client";

import { LoaderCircle, Settings, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { PwaInstallButton } from "@/components/pwa/pwa-install-button";
import { PushSubscribeButton } from "@/components/pwa/push-subscribe-button";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import type { UserRole } from "@/db/schema";
import { deleteAccount } from "@/server/actions/onboarding";
import { saveReminderSettings } from "@/server/actions/reminders";

type SettingsSheetProps = {
  role: UserRole;
  remindersEnabled: boolean;
};

export function SettingsSheet({ role, remindersEnabled }: SettingsSheetProps) {
  const router = useRouter();
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
        className="inline-flex size-10 items-center justify-center text-primary"
        aria-label="Ajustes"
      >
        <Settings className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Ajustes</SheetTitle>
          <SheetDescription>
            {role === "patient"
              ? "Gestiona recordatorios, notificaciones, sesión y cuenta."
              : "Gestiona tu sesión y cuenta."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col px-4">
          <div className="space-y-4 overflow-y-auto">
            {role === "patient" ? (
              <div className="flex items-center justify-between rounded-xl bg-secondary p-4">
                <div className="space-y-1">
                  <Label htmlFor="reminders">Recordatorios</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe un aviso diario a las 21:00 para registrar tu día.
                  </p>
                </div>
                <Switch
                  id="reminders"
                  checked={enabled}
                  onCheckedChange={handleEnabledChange}
                />
              </div>
            ) : null}

            <PushSubscribeButton />
            <PwaInstallButton />

            <div className="w-full">
              <AlertDialog>
                <AlertDialogTrigger
                  className="w-full"
                  render={<Button variant="destructive" />}
                >
                  <Trash2 data-icon="inline-start" aria-hidden="true" />
                  Eliminar cuenta
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
            </div>
          </div>

          <div className="mt-auto w-full pb-4 pt-6">
            <SettingsSignOutDialog />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
