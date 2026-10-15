import type { MoodQuadrant } from "@/db/schema";
import { getMoodStyles, type MoodTone } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type MoodBubbleProps = {
  quadrant: MoodQuadrant | null;
  tone?: MoodTone;
  className?: string;
  children?: React.ReactNode;
};

export function MoodBubble({
  quadrant,
  tone = 2,
  className,
  children,
}: MoodBubbleProps) {
  const styles = getMoodStyles(quadrant);

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full text-mood-foreground",
        styles.tones[tone],
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full bg-radial-[at_30%_25%] from-white/55 via-transparent to-transparent"
        aria-hidden="true"
      />
      <span className="relative">{children}</span>
    </span>
  );
}
