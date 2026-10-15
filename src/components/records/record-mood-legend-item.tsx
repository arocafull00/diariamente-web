import { MoodBubble } from "@/components/records/mood-bubble";
import type { MoodQuadrant } from "@/db/schema";

type RecordMoodLegendItemProps = {
  quadrant: MoodQuadrant;
  label: string;
  count: number;
};

export function RecordMoodLegendItem({
  quadrant,
  label,
  count,
}: RecordMoodLegendItemProps) {
  return (
    <li className="flex items-center gap-2 text-xs">
      <MoodBubble quadrant={quadrant} tone={3} className="size-3.5" />
      <span className="min-w-0 flex-1 truncate text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{count}</span>
    </li>
  );
}
