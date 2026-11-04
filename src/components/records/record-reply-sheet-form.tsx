"use client";

import { Eye, LoaderCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { RecordReplyDeleteDialog } from "@/components/records/record-reply-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { upsertRecordReply } from "@/server/actions/record-replies";

const MAX_REPLY_LENGTH = 500;

type RecordReplySheetFormProps = {
  recordId: string;
  initialContent: string;
  isEditing: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RecordReplySheetForm({
  recordId,
  initialContent,
  isEditing,
  onOpenChange,
}: RecordReplySheetFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState(initialContent);
  const trimmedLength = content.trim().length;

  function handleSave() {
    startTransition(async () => {
      const result = await upsertRecordReply(recordId, { content });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditing ? "¡Respuesta actualizada!" : "¡Respuesta enviada!");
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <>
      <SheetHeader className="px-5 pt-6 pb-4">
        <SheetTitle className="text-2xl font-bold tracking-tight">
          {isEditing ? "Editar respuesta" : "Responder"}
        </SheetTitle>
        <SheetDescription>
          Unas palabras para que tu paciente sepa que lo has leído.
        </SheetDescription>
      </SheetHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6">
        <div className="flex items-center gap-3 rounded-2xl bg-mood-lu-soft p-3">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-mood-lu-strong shadow-xs"
          >
            <Eye className="size-5" />
          </span>
          <p className="min-w-0 flex-1 text-sm leading-snug text-mood-foreground/80">
            <span className="block font-semibold text-mood-lu-strong">
              Tu paciente verá este mensaje
            </span>
            Le avisaremos con una notificación sin el contenido.
          </p>
        </div>
        <div className="space-y-2">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Gracias por registrarlo. Lo vemos en la próxima sesión."
            rows={6}
            maxLength={MAX_REPLY_LENGTH}
            disabled={pending}
            aria-label="Respuesta para tu paciente"
            className="min-h-36 resize-none rounded-2xl bg-card"
          />
          <p className="px-1 text-right text-xs text-muted-foreground">
            {content.length}/{MAX_REPLY_LENGTH}
          </p>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <Button
            size="lg"
            className="w-full"
            disabled={pending || trimmedLength === 0}
            onClick={handleSave}
          >
            {pending ? (
              <LoaderCircle
                className="animate-spin"
                data-icon="inline-start"
                aria-hidden="true"
              />
            ) : (
              <Send data-icon="inline-start" aria-hidden="true" />
            )}
            {pending ? "Guardando..." : isEditing ? "Guardar cambios" : "Enviar respuesta"}
          </Button>
          {isEditing ? (
            <RecordReplyDeleteDialog
              recordId={recordId}
              onDeleted={() => onOpenChange(false)}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
