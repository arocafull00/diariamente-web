"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
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
import { deleteRecordNote } from "@/server/actions/record-notes";

type RecordNoteDeleteDialogProps = {
  recordId: string;
  onDeleted?: () => void;
  className?: string;
};

export function RecordNoteDeleteDialog({
  recordId,
  onDeleted,
  className,
}: RecordNoteDeleteDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteRecordNote(recordId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Nota eliminada");
      onDeleted?.();
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          buttonVariants({ variant: "destructive" }),
          className,
        )}
      >
        <Trash2 data-icon="inline-start" aria-hidden="true" />
        Eliminar
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar la nota?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. La nota se borrará de forma
            permanente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            data-cuelume-tap="close"
            data-cuelume-emphasis="strong"
            disabled={pending}
            onClick={handleDelete}
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
            {pending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
