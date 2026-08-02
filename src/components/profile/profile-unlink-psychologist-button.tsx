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
import { unlinkFromPsychologist } from "@/server/actions/invitations";

export function ProfileUnlinkPsychologistButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleUnlink() {
    startTransition(async () => {
      const result = await unlinkFromPsychologist();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Psicólogo desvinculado");
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        Desvincular
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desvincular psicólogo?</AlertDialogTitle>
          <AlertDialogDescription>
            Tu psicólogo dejará de acceder a tus registros. Podrás vincularte de
            nuevo con un enlace de invitación.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={handleUnlink}>
            {pending ? (
              <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
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
