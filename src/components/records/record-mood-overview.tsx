import { RecordMoodBarSegment } from "@/components/records/record-mood-bar-segment";
import { RecordMoodLegendItem } from "@/components/records/record-mood-legend-item";
import type { MoodQuadrant, PatientRecord } from "@/db/schema";
import {
  getQuadrantLabel,
  getRecordQuadrant,
  MOOD_QUADRANTS,
  MOOD_STYLES,
} from "@/lib/emotions";

type RecordMoodOverviewProps = {
  title: string;
  records: Pick<PatientRecord, "quadrant" | "emotions">[];
};

export function RecordMoodOverview({ title, records }: RecordMoodOverviewProps) {
  const counts = new Map<MoodQuadrant, number>();

  for (const record of records) {
    const quadrant = getRecordQuadrant(record);

    if (quadrant) {
      counts.set(quadrant, (counts.get(quadrant) ?? 0) + 1);
    }
  }

  const total = Array.from(counts.values()).reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border/60">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl font-medium">{title}</h2>
        <p className="text-xs text-muted-foreground">
          {total} {total === 1 ? "registro" : "registros"}
        </p>
      </div>
      <div className="flex h-4 gap-1 overflow-hidden rounded-full">
        {MOOD_QUADRANTS.filter((quadrant) => counts.has(quadrant.id)).map(
          (quadrant, index) => (
            <RecordMoodBarSegment
              key={quadrant.id}
              index={index}
              percent={((counts.get(quadrant.id) ?? 0) / total) * 100}
              className={MOOD_STYLES[quadrant.id].tones[3]}
            />
          ),
        )}
      </div>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {MOOD_QUADRANTS.map((quadrant) => (
          <RecordMoodLegendItem
            key={quadrant.id}
            quadrant={quadrant.id}
            label={getQuadrantLabel(quadrant.id)}
            count={counts.get(quadrant.id) ?? 0}
          />
        ))}
      </ul>
    </section>
  );
}
