import { MoodBubble } from "@/components/records/mood-bubble";
import type { MoodQuadrant } from "@/db/schema";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type ClinicStatCardProps = {
  label: string;
  value: number;
  quadrant: MoodQuadrant;
};

export function ClinicStatCard({ label, value, quadrant }: ClinicStatCardProps) {
  const styles = getMoodStyles(quadrant);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-4 lg:p-5",
        styles.soft,
      )}
    >
      <MoodBubble
        quadrant={quadrant}
        tone={1}
        className="absolute -top-6 -right-6 size-16 opacity-70"
      />
      <p
        className={cn(
          "relative font-display text-4xl leading-none font-medium tracking-tight",
          styles.strong,
        )}
      >
        {value}
      </p>
      <p className="relative mt-2 text-xs font-medium text-pretty text-mood-foreground/70">
        {label}
      </p>
    </div>
  );
}
