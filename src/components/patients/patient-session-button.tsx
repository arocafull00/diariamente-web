"use client";

import { CalendarCheck, LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { markTherapySession } from "@/server/actions/therapy-sessions";

type PatientSessionButtonProps = {
  patientId: string;
  patientName: string;
};

export function PatientSessionButton({
  patientId,
  patientName,
}: PatientSessionButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleMark() {
    startTransition(async () => {
      const result = await markTherapySession(patientId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Sesión registrada");
      setOpen(false);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "w-full",
        )}
      >
        <CalendarCheck data-icon="inline-start" aria-hidden="true" />
        Marcar sesión de hoy
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Has tenido sesión hoy con {patientName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            El resumen empezará de cero y mostrará solo los registros que haga
            a partir de ahora.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={handleMark}>
            {pending ? (
              <LoaderCircle
                className="animate-spin"
                data-icon="inline-start"
                aria-hidden="true"
              />
            ) : (
              <CalendarCheck data-icon="inline-start" aria-hidden="true" />
            )}
            {pending ? "Guardando..." : "Marcar sesión"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
