"use client";

import { EllipsisVertical, LoaderCircle, Unlink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { unlinkPatient } from "@/server/actions/invitations";

type PatientActionsMenuProps = {
  patientId: string;
  patientName: string;
};

export function PatientActionsMenu({
  patientId,
  patientName,
}: PatientActionsMenuProps) {
  const router = useRouter();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger
          ref={triggerRef}
          aria-label="Más opciones del paciente"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95"
        >
          <EllipsisVertical className="size-5" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            variant="destructive"
            className="min-h-11 gap-2 px-3"
            onClick={() => setOpen(true)}
          >
            <Unlink aria-hidden="true" />
            Desvincular paciente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent finalFocus={triggerRef}>
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
