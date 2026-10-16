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
      <span className="relative">{children}</span>
    </span>
  );
}
