"use client";

import { LoaderCircle, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
import { removeClinicPsychologist } from "@/server/actions/clinics";

type ClinicRemovePsychologistButtonProps = {
  psychologistId: string;
  psychologistName: string;
};

export function ClinicRemovePsychologistButton({
  psychologistId,
  psychologistName,
}: ClinicRemovePsychologistButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      const result = await removeClinicPsychologist(psychologistId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Hecho, ya no forma parte de la clínica");
      router.replace("/clinica");
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          buttonVariants({ variant: "destructive", size: "lg" }),
          "w-full sm:w-auto",
        )}
      >
        <UserMinus data-icon="inline-start" aria-hidden="true" />
        Quitar de la clínica
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Quitar a {psychologistName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Dejarás de ver su actividad. Sus pacientes seguirán vinculados con
            este profesional y podrás invitarle de nuevo más adelante.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={handleRemove}
          >
            {pending ? (
              <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
            ) : (
              <UserMinus data-icon="inline-start" aria-hidden="true" />
            )}
            {pending ? "Quitando..." : "Quitar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
