"use client";

import { LoaderCircle, Trash2, TriangleAlert } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSignOut } from "@/hooks/use-sign-out";
import { deleteAccount } from "@/server/actions/onboarding";

import { SettingsConfirmHeader } from "./settings-confirm-header";
import {
  confirmDialogContentClassName,
  confirmDialogFooterClassName,
} from "./settings-dialog-styles";
import { SettingsRowContent, settingsRowClassName } from "./settings-row-content";

export function SettingsDeleteAccountDialog() {
  const signOut = useSignOut();
  const [pending, startTransition] = useTransition();

  function handleDeleteAccount() {
    startTransition(async () => {
      const result = await deleteAccount();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      void signOut().catch(() => {});
      window.location.assign("/empezar");
    });
  }

  return (
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
      <AlertDialogContent className={confirmDialogContentClassName}>
        <SettingsConfirmHeader
          faceId="tristeza"
          title={
            <>
              ¿Eliminar tu{" "}
              <span className="text-mood-hu-strong italic">cuenta</span>?
            </>
          }
          description="Sentiremos que te vayas."
        />
        <div className="flex items-center gap-3 rounded-2xl bg-mood-hu-soft p-3">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-mood-hu-strong shadow-xs"
          >
            <TriangleAlert className="size-5" />
          </span>
          <p className="min-w-0 flex-1 text-sm leading-snug text-mood-foreground/80">
            <span className="block font-semibold text-mood-hu-strong">
              No se puede deshacer
            </span>
            Se eliminarán todos tus datos de forma permanente.
          </p>
        </div>
        <AlertDialogFooter className={confirmDialogFooterClassName}>
          <AlertDialogCancel size="lg" className="w-full">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            data-cuelume-tap="close"
            data-cuelume-emphasis="strong"
            size="lg"
            className="btn-raised-danger w-full text-primary-foreground"
            disabled={pending}
            onClick={handleDeleteAccount}
          >
            {pending ? (
              <LoaderCircle
                className="animate-spin"
                data-icon="inline-start"
                aria-hidden="true"
              />
            ) : (
              <Trash2 data-icon="inline-start" aria-hidden="true" />
            )}
            {pending ? "Eliminando..." : "Eliminar cuenta"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
