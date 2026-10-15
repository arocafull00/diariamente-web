import { RecordContextGroup } from "@/components/records/record-context-group";
import type { MoodQuadrant, RecordContext } from "@/db/schema";
import { CONTEXT_GROUPS } from "@/lib/context-tags";
import { getMoodStyles } from "@/lib/emotions";

type RecordContextSectionProps = {
  context: RecordContext;
  quadrant: MoodQuadrant | null;
};

export function RecordContextSection({ context, quadrant }: RecordContextSectionProps) {
  const groups = CONTEXT_GROUPS.filter((group) => context[group.id].length > 0);

  if (groups.length === 0) {
    return null;
  }

  const styles = getMoodStyles(quadrant);

  return (
    <section className="space-y-4 rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border/60 sm:p-6">
      <h2 className="font-display text-xl font-medium">Contexto</h2>
      {groups.map((group) => (
        <RecordContextGroup
          key={group.id}
          label={group.label}
          tags={context[group.id]}
          styles={styles}
        />
      ))}
    </section>
  );
}
