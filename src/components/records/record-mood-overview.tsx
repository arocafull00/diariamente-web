import { ChevronDown } from "lucide-react";

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
    <details className="group/balance rounded-3xl bg-card shadow-sm ring-1 ring-border/60 motion-safe:animate-disclosure">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-3xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <h2 className="min-w-0 flex-1 font-display text-xl font-medium">
          {title}
        </h2>
        <span className="shrink-0 text-xs text-muted-foreground">
          {total} {total === 1 ? "registro" : "registros"}
        </span>
        <ChevronDown
          className="size-5 shrink-0 text-mood-lp-strong transition-transform duration-200 ease-out group-open/balance:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </summary>
      <div className="grid min-h-0 overflow-hidden">
        <div className="overflow-hidden">
          <div className="space-y-4 px-5 pb-5">
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
          </div>
        </div>
      </div>
    </details>
  );
}
