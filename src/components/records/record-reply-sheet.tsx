"use client";

import { MessageCircleHeart, PencilLine } from "lucide-react";
import { useState } from "react";

import { RecordReplySheetForm } from "@/components/records/record-reply-sheet-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type RecordReplySheetProps = {
  recordId: string;
  initialContent: string;
};

export function RecordReplySheet({ recordId, initialContent }: RecordReplySheetProps) {
  const [open, setOpen] = useState(false);
  const isEditing = initialContent.length > 0;
  const formKey = open ? `${recordId}:${initialContent}` : "closed";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant={isEditing ? "outline" : "default"} size="sm" />}
      >
        {isEditing ? (
          <PencilLine data-icon="inline-start" aria-hidden="true" />
        ) : (
          <MessageCircleHeart data-icon="inline-start" aria-hidden="true" />
        )}
        {isEditing ? "Editar respuesta" : "Responder"}
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex flex-col gap-0 bg-background sm:max-w-md"
      >
        <RecordReplySheetForm
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
