"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { PushSubscribeButton } from "@/components/pwa/push-subscribe-button";
import { AppHeader } from "@/components/app-shell/app-header";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { UserRole } from "@/db/schema";
import { deleteAccount } from "@/server/actions/onboarding";
import { saveReminderSettings } from "@/server/actions/reminders";

type SettingsFormProps = {
  role: UserRole;
  reminderSettings: {
    enabled: boolean;
    frequency: "daily" | "weekly";
    time: string;
    days: string[];
  } | null;
};

export function SettingsForm({ role, reminderSettings }: SettingsFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [enabled, setEnabled] = useState(reminderSettings?.enabled ?? false);
  const [frequency, setFrequency] = useState<"daily" | "weekly">(
    reminderSettings?.frequency ?? "daily",
  );
  const [time, setTime] = useState(reminderSettings?.time ?? "20:00");

  function handleSaveReminders() {
    startTransition(async () => {
      const result = await saveReminderSettings({
        enabled,
        frequency,
        time,
        days: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Recordatorios guardados");
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
    <>
      <AppHeader title="Ajustes" backHref="/perfil" />
      <div className="space-y-4">
        {role === "patient" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recordatorios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reminders">Activar recordatorios</Label>
                <Switch
                  id="reminders"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={frequency === "daily" ? "default" : "outline"}
                  onClick={() => setFrequency("daily")}
                >
                  Diario
                </Button>
                <Button
                  type="button"
                  variant={frequency === "weekly" ? "default" : "outline"}
                  onClick={() => setFrequency("weekly")}
                >
                  Semanal
                </Button>
              </div>
              <Button
                className="w-full"
                disabled={pending}
                onClick={handleSaveReminders}
              >
                {pending ? "Guardando..." : "Guardar recordatorios"}
              </Button>
              <PushSubscribeButton />
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardContent className="p-4">
            <SignOutButton redirectUrl="/login">
              <Button variant="outline" className="w-full">
                Cerrar sesión
              </Button>
            </SignOutButton>
          </CardContent>
        </Card>

        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive" className="w-full">
              Eliminar cuenta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar tu cuenta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminarán todos tus datos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletePending}
                onClick={handleDeleteAccount}
              >
                {deletePending ? "Eliminando..." : "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
