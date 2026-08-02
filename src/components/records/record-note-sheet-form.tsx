"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { RecordNoteDeleteDialog } from "@/components/records/record-note-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { upsertRecordNote } from "@/server/actions/record-notes";

type RecordNoteSheetFormProps = {
  recordId: string;
  initialContent: string;
  isEditing: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RecordNoteSheetForm({
  recordId,
  initialContent,
  isEditing,
  onOpenChange,
}: RecordNoteSheetFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState(initialContent);

  function handleSave() {
    startTransition(async () => {
      const result = await upsertRecordNote(recordId, { content });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditing ? "Nota actualizada" : "Nota guardada");
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>{isEditing ? "Editar nota" : "Añadir nota"}</SheetTitle>
        <SheetDescription>
          Esta nota es privada. Solo tú puedes verla; el paciente no tiene
          acceso a ella.
        </SheetDescription>
      </SheetHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escribe tu nota clínica..."
          rows={8}
          disabled={pending}
          aria-label="Contenido de la nota"
          className="min-h-40 flex-1 resize-none"
        />
      </div>
      <SheetFooter className="flex-row items-center justify-between gap-2">
        {isEditing ? (
          <RecordNoteDeleteDialog
            recordId={recordId}
            className="w-28"
            onDeleted={() => onOpenChange(false)}
          />
        ) : (
          <span aria-hidden="true" />
        )}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="w-28"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            className="w-28"
            disabled={pending || content.trim().length === 0}
            onClick={handleSave}
          >
            {pending ? (
              <LoaderCircle
                className="animate-spin"
                data-icon="inline-start"
                aria-hidden="true"
              />
            ) : (
              <Save data-icon="inline-start" aria-hidden="true" />
            )}
            {pending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </SheetFooter>
    </>
  );
}
