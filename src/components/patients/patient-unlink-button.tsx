"use client";

import { LoaderCircle, Unlink } from "lucide-react";
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
import { unlinkPatient } from "@/server/actions/invitations";

type PatientUnlinkButtonProps = {
  patientId: string;
  patientName: string;
  layout?: "footer" | "header";
};

export function PatientUnlinkButton({
  patientId,
  patientName,
  layout = "footer",
}: PatientUnlinkButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleUnlink() {
    startTransition(async () => {
      const result = await unlinkPatient(patientId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Paciente desvinculado");
      router.push("/pacientes");
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={
          layout === "header"
            ? cn(
                buttonVariants({ variant: "destructive", size: "sm" }),
                "hidden shrink-0 shadow-xs sm:inline-flex",
              )
            : cn(buttonVariants({ variant: "destructive" }), "w-full sm:hidden")
        }
      >
        {layout === "header" ? null : (
          <Unlink data-icon="inline-start" aria-hidden="true" />
        )}
        Desvincular{layout === "footer" ? " paciente" : ""}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desvincular a {patientName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Dejarás de acceder a los registros de este paciente. Podrás volver a
            vincularlo con un enlace de invitación.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            data-cuelume-tap="close"
            data-cuelume-emphasis="strong"
            disabled={pending}
            onClick={handleUnlink}
          >
            {pending ? (
              <LoaderCircle
                className="animate-spin"
                data-icon="inline-start"
                aria-hidden="true"
              />
            ) : (
              <Unlink data-icon="inline-start" aria-hidden="true" />
            )}
            {pending ? "Desvinculando..." : "Desvincular"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
