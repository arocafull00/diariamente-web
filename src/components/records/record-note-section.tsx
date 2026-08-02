"use client";

import { Pencil, Plus, StickyNote } from "lucide-react";
import { useState } from "react";

import { RecordNoteDeleteDialog } from "@/components/records/record-note-delete-dialog";
import { RecordNoteDialog } from "@/components/records/record-note-dialog";
import { Button } from "@/components/ui/button";
import type { RecordNote } from "@/db/schema";

type RecordNoteSectionProps = {
  recordId: string;
  note: RecordNote | null;
};

export function RecordNoteSection({ recordId, note }: RecordNoteSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section className="space-y-3 rounded-xl bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
          <StickyNote className="size-4" aria-hidden="true" />
        </span>
        <h2 className="text-sm font-semibold">Nota privada</h2>
      </div>

      {note ? (
        <>
          <p className="text-sm leading-6 whitespace-pre-wrap text-foreground">
            {note.content}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Pencil data-icon="inline-start" aria-hidden="true" />
              Editar nota
            </Button>
            <RecordNoteDeleteDialog recordId={recordId} />
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Añade una nota clínica privada sobre este registro.
          </p>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus data-icon="inline-start" aria-hidden="true" />
            Añadir nota
          </Button>
        </>
      )}

      <RecordNoteDialog
        recordId={recordId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialContent={note?.content ?? ""}
      />
    </section>
  );
}
