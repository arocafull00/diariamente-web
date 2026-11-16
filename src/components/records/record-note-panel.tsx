import type { RecordNote } from "@/db/schema";

type RecordNotePanelProps = {
  note: RecordNote;
};

export function RecordNotePanel({ note }: RecordNotePanelProps) {
  return (
    <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
      <section className="space-y-3 rounded-xl bg-card p-5 shadow-sm">
        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Nota privada</h2>
        <p className="text-sm leading-6 whitespace-pre-wrap text-foreground">
          {note.content}
        </p>
      </section>
    </aside>
  );
}
