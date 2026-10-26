"use client";

import { BellRing, LoaderCircle } from "lucide-react";
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
import { sendPatientReminder } from "@/server/actions/reminders";

type PatientReminderButtonProps = {
  patientId: string;
  patientName: string;
  className?: string;
};

export function PatientReminderButton({
  patientId,
  patientName,
  className,
}: PatientReminderButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSend() {
    startTransition(async () => {
      const result = await sendPatientReminder(patientId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(`Recordatorio enviado a ${patientName}`);
      setOpen(false);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        aria-label={`Enviar recordatorio a ${patientName}`}
        title="Enviar recordatorio"
        className={cn(
          buttonVariants({ variant: "secondary", size: "icon-lg" }),
          className,
        )}
      >
        <BellRing aria-hidden="true" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Enviar recordatorio a {patientName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Recibirá una notificación: «Hola, hace tiempo que no te conectas.
            ¿Quieres registrar alguna emoción del día?»
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={handleSend}>
            {pending ? (
              <LoaderCircle
                className="animate-spin"
                data-icon="inline-start"
                aria-hidden="true"
              />
            ) : (
              <BellRing data-icon="inline-start" aria-hidden="true" />
            )}
            {pending ? "Enviando..." : "Enviar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
