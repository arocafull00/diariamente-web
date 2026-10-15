import type { MoodQuadrant } from "@/db/schema";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type HomeMoodRingSegmentProps = {
  quadrant: MoodQuadrant | null;
  index: number;
  total: number;
  radius: number;
  delay: number;
};

const GAP = 14;

export function HomeMoodRingSegment({
  quadrant,
  index,
  total,
  radius,
  delay,
}: HomeMoodRingSegmentProps) {
  const circumference = 2 * Math.PI * radius;
  const slot = circumference / total;
  const length = total > 1 ? slot - GAP : circumference;

  return (
    <circle
      cx="120"
      cy="120"
      r={radius}
      fill="none"
      strokeWidth="18"
      strokeLinecap={total > 1 ? "round" : "butt"}
      strokeDasharray={`${length} ${circumference - length}`}
      strokeDashoffset={-index * slot}
      className={cn(
        "animate-in duration-700 fade-in fill-mode-backwards",
        getMoodStyles(quadrant).stroke,
      )}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
