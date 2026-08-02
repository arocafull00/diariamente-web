"use client";

import { StickyNote } from "lucide-react";
import { useState } from "react";

import { RecordNoteSheetForm } from "@/components/records/record-note-sheet-form";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { RecordNote } from "@/db/schema";

type RecordNoteSheetProps = {
  recordId: string;
  note: RecordNote | null;
};

export function RecordNoteSheet({ recordId, note }: RecordNoteSheetProps) {
  const [open, setOpen] = useState(false);
  const initialContent = note?.content ?? "";
  const isEditing = initialContent.length > 0;
  const formKey = open ? `${recordId}:${initialContent}` : "closed";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center gap-1.5 text-primary lg:w-auto lg:px-3"
        aria-label={isEditing ? "Editar nota" : "Añadir nota"}
      >
        <StickyNote className="size-5 shrink-0" aria-hidden="true" />
        <span className="hidden text-sm font-semibold lg:inline">
          {isEditing ? "Editar nota" : "Añadir nota"}
        </span>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col sm:max-w-md">
        <RecordNoteSheetForm
          key={formKey}
          recordId={recordId}
          initialContent={initialContent}
          isEditing={isEditing}
          onOpenChange={setOpen}
        />
      </SheetContent>
    </Sheet>
  );
}
