import { MoodBubble } from "@/components/records/mood-bubble";
import type { MoodQuadrant } from "@/db/schema";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type ClinicStatCardProps = {
  label: string;
  value: number;
  quadrant: MoodQuadrant;
  inline?: boolean;
};

export function ClinicStatCard({
  label,
  value,
  quadrant,
  inline = false,
}: ClinicStatCardProps) {
  const styles = getMoodStyles(quadrant);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl p-4 lg:p-5",
        inline && "flex items-center gap-3 py-3.5 lg:py-4",
        styles.soft,
      )}
    >
      <MoodBubble
        quadrant={quadrant}
        tone={1}
        className="absolute -top-6 -right-6 size-16 opacity-70 transition-[scale] duration-500 ease-out-quart group-hover:scale-125"
      />
      <p
        className={cn(
          "relative font-display text-4xl leading-none font-medium tracking-tight motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:ease-out-quart",
          styles.strong,
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "relative text-xs font-medium text-pretty text-mood-foreground/70",
          inline ? "text-sm" : "mt-2",
        )}
      >
        {label}
      </p>
    </div>
  );
}
