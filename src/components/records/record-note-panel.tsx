import { StickyNote } from "lucide-react";

import type { RecordNote } from "@/db/schema";

type RecordNotePanelProps = {
  note: RecordNote;
};

export function RecordNotePanel({ note }: RecordNotePanelProps) {
  return (
    <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
      <section className="space-y-3 rounded-xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
            <StickyNote className="size-4" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-semibold">Nota privada</h2>
        </div>
        <p className="text-sm leading-6 whitespace-pre-wrap text-foreground">
          {note.content}
        </p>
      </section>
    </aside>
  );
}
