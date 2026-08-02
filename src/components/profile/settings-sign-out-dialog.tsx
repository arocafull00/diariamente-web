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

export function SettingsSignOutDialog() {
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

  return (
    <div className="w-full">
      <AlertDialog>
        <AlertDialogTrigger
          className="w-full"
          render={<Button variant="secondary" />}
        >
          <LogOut data-icon="inline-start" aria-hidden="true" />
          Cerrar sesión
        </AlertDialogTrigger>
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
                <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
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
