"use client";

import { ArrowRightLeft, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  confirmDialogContentClassName,
  confirmDialogFooterClassName,
} from "@/components/profile/settings-dialog-styles";
import { SettingsConfirmHeader } from "@/components/profile/settings-confirm-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { unlinkFromPsychologist } from "@/server/actions/invitations";

type ConnectSwitchPsychologistDialogProps = {
  currentName: string;
  newName: string;
};

export function ConnectSwitchPsychologistDialog({
  currentName,
  newName,
}: ConnectSwitchPsychologistDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleSwitch() {
    startTransition(async () => {
      const result = await unlinkFromPsychologist();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(`¡Listo! Ya puedes conectar con ${newName}`);
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button size="lg" className="w-full" />}>
        <ArrowRightLeft data-icon="inline-start" aria-hidden="true" />
        Cambiar a {newName}
      </AlertDialogTrigger>
      <AlertDialogContent className={confirmDialogContentClassName}>
        <SettingsConfirmHeader
          faceId="03_verde_morado"
          title={
            <>
              ¿Cambiar de{" "}
              <span className="text-mood-lp-strong italic">psicólogo/a</span>?
            </>
          }
          description={`Te desvincularás de ${currentName} y después podrás conectar con ${newName}.`}
        />
        <div className="flex items-center gap-3 rounded-2xl bg-mood-hp-soft p-3">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-mood-hp-strong shadow-xs"
          >
            <EyeOff className="size-5" />
          </span>
          <p className="min-w-0 flex-1 text-left text-sm leading-snug text-mood-foreground/80">
            <span className="block font-semibold text-mood-hp-strong">
              {currentName} dejará de ver tus registros
            </span>
            Para volver a conectar, necesitarás su código.
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
            className="w-full"
            disabled={pending}
            onClick={handleSwitch}
          >
            {pending ? (
              <LoaderCircle
                className="animate-spin"
                data-icon="inline-start"
                aria-hidden="true"
              />
            ) : (
              <ArrowRightLeft data-icon="inline-start" aria-hidden="true" />
            )}
            {pending ? "Desvinculando..." : "Desvincular y continuar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
