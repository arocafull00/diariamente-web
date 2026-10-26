import { MoodBubble } from "@/components/records/mood-bubble";
import type { MoodQuadrant } from "@/db/schema";

type DictationOverlayProps = {
  quadrant: MoodQuadrant | null;
};

export function DictationOverlay({ quadrant }: DictationOverlayProps) {
  return (
    <div
      role="status"
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 bg-background/70 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative flex size-44 items-center justify-center">
        <MoodBubble
          quadrant={quadrant}
          tone={1}
          className="absolute inset-0 size-full opacity-60 blur-xl animate-mood-ghost motion-reduce:animate-none"
        />
        <MoodBubble
          quadrant={quadrant}
          tone={2}
          className="size-32 animate-mood-wobble [animation-duration:2.5s] motion-reduce:animate-none"
        />
      </div>
      <p className="font-display text-2xl">Te escucho...</p>
    </div>
  );
}
