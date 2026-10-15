import type { MoodQuadrant } from "@/db/schema";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type RecordIntensityDotsProps = {
  quadrant: MoodQuadrant | null;
  intensity: number;
  label: string;
};

const LEVELS = Array.from({ length: 10 }, (_, index) => index + 1);

export function RecordIntensityDots({
  quadrant,
  intensity,
  label,
}: RecordIntensityDotsProps) {
  const styles = getMoodStyles(quadrant);

  return (
    <div
      className="flex items-end gap-1"
      role="meter"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={10}
      aria-valuenow={intensity}
    >
      {LEVELS.map((level) => (
        <span
          key={level}
          className={cn(
            "w-2.5 rounded-full transition-all",
            level <= intensity ? styles.tones[3] : "bg-foreground/10",
          )}
          style={{ height: `${8 + level * 2}px` }}
        />
      ))}
    </div>
  );
}
