"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { upsertRecordNote } from "@/server/actions/record-notes";

type RecordNoteDialogProps = {
  recordId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContent: string;
};

export function RecordNoteDialog({
  recordId,
  open,
  onOpenChange,
  initialContent,
}: RecordNoteDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState(initialContent);
  const isEditing = initialContent.length > 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    setContent(initialContent);
  }, [open, initialContent]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar nota" : "Añadir nota"}</DialogTitle>
          <DialogDescription>
            Esta nota es privada. Solo tú puedes verla; el paciente no tiene
            acceso a ella.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escribe tu nota clínica..."
          rows={6}
          disabled={pending}
          aria-label="Contenido de la nota"
        />
        <DialogFooter>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button disabled={pending || content.trim().length === 0} onClick={handleSave}>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
