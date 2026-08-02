"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";

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

type SettingsSignOutDialogProps = {
  variant?: "button" | "icon";
};

export function SettingsSignOutDialog({
  variant = "button",
}: SettingsSignOutDialogProps) {
  const { signOut } = useClerk();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);

    try {
      await signOut({ redirectUrl: "/login" });
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
        className="w-full"
        render={<Button variant="secondary" />}
      >
        <LogOut data-icon="inline-start" aria-hidden="true" />
        Cerrar sesión
      </AlertDialogTrigger>
    );

  return (
    <div className={variant === "icon" ? undefined : "w-full"}>
      <AlertDialog>
        {trigger}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              Tendrás que volver a iniciar sesión para acceder a tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={pending} onClick={handleSignOut}>
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
    </div>
  );
}
