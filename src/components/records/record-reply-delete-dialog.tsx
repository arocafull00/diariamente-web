"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { SettingsConfirmHeader } from "@/components/profile/settings-confirm-header";
import {
  confirmDialogContentClassName,
  confirmDialogFooterClassName,
} from "@/components/profile/settings-dialog-styles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteRecordReply } from "@/server/actions/record-replies";

type RecordReplyDeleteDialogProps = {
  recordId: string;
  onDeleted: () => void;
};

export function RecordReplyDeleteDialog({
  recordId,
  onDeleted,
}: RecordReplyDeleteDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteRecordReply(recordId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Respuesta eliminada");
      onDeleted();
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "w-full text-muted-foreground",
        )}
      >
        <Trash2 data-icon="inline-start" aria-hidden="true" />
        Quitar respuesta
      </AlertDialogTrigger>
      <AlertDialogContent className={confirmDialogContentClassName}>
        <SettingsConfirmHeader
          faceId="tristeza"
          title={
            <>
              ¿Quitar tu{" "}
              <span className="text-mood-hu-strong italic">respuesta</span>?
            </>
          }
          description="Tu paciente dejará de verla en este registro."
        />
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
            {pending ? "Quitando..." : "Quitar respuesta"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
