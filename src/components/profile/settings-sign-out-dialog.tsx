"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/hooks/use-sign-out";

import { SettingsConfirmHeader } from "./settings-confirm-header";
import {
  confirmDialogContentClassName,
  confirmDialogFooterClassName,
} from "./settings-dialog-styles";
import { SettingsRowContent, settingsRowClassName } from "./settings-row-content";

type SettingsSignOutDialogProps = {
  variant?: "button" | "icon";
};

export function SettingsSignOutDialog({
  variant = "button",
}: SettingsSignOutDialogProps) {
  const signOut = useSignOut();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);

    try {
      await signOut();
    } finally {
      setPending(false);
    }
  }

  const trigger =
    variant === "icon" ? (
      <AlertDialogTrigger
        aria-label="Cerrar sesión"
        render={<Button variant="ghost" size="icon" />}
      >
        <LogOut aria-hidden="true" />
      </AlertDialogTrigger>
    ) : (
      <AlertDialogTrigger
        data-slot="settings-row"
        className={settingsRowClassName}
      >
        <SettingsRowContent icon={LogOut} tone="primary" title="Cerrar sesión" />
      </AlertDialogTrigger>
    );

  return (
    <AlertDialog>
      {trigger}
      <AlertDialogContent className={confirmDialogContentClassName}>
        <SettingsConfirmHeader
          faceId="02_azul_rosa"
          title={
            <>
              ¿Cerrar <span className="text-mood-lu-strong italic">sesión</span>?
            </>
          }
          description="Para volver, solo tendrás que iniciar sesión de nuevo. ¡Aquí te esperamos!"
        />
        <AlertDialogFooter className={confirmDialogFooterClassName}>
          <AlertDialogCancel size="lg" className="w-full">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            data-cuelume-tap="close"
            data-cuelume-emphasis="strong"
            size="lg"
            className="w-full"
            disabled={pending}
            onClick={handleSignOut}
          >
            {pending ? (
              <LoaderCircle
                className="animate-spin"
                data-icon="inline-start"
                aria-hidden="true"
              />
            ) : (
              <LogOut data-icon="inline-start" aria-hidden="true" />
            )}
            {pending ? "Cerrando sesión..." : "Cerrar sesión"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
