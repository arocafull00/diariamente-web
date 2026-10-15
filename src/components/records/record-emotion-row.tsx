import { MoodBubble } from "@/components/records/mood-bubble";
import { RecordIntensityDots } from "@/components/records/record-intensity-dots";
import type { RecordEmotion } from "@/db/schema";
import { getEmotionQuadrant } from "@/lib/emotions";

type RecordEmotionRowProps = {
  emotion: RecordEmotion;
};

export function RecordEmotionRow({ emotion }: RecordEmotionRowProps) {
  const quadrant = getEmotionQuadrant(emotion.emotion);

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border/60">
      <MoodBubble
        quadrant={quadrant}
        tone={3}
        className="size-10 font-display text-sm font-semibold"
      >
        {emotion.intensity}
      </MoodBubble>
      <span className="min-w-0 flex-1 truncate font-semibold">{emotion.emotion}</span>
      <RecordIntensityDots
        quadrant={quadrant}
        intensity={emotion.intensity}
        label={`Intensidad de ${emotion.emotion}`}
      />
    </div>
  );
}
