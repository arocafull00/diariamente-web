import { MoodBubble } from "@/components/records/mood-bubble";
import { RecordIntensityDots } from "@/components/records/record-intensity-dots";
import type { GrammaticalGender, RecordEmotion } from "@/db/schema";
import { getEmotionLabel, getEmotionQuadrant } from "@/lib/emotions";

type RecordEmotionRowProps = {
  emotion: RecordEmotion;
  gender: GrammaticalGender;
};

export function RecordEmotionRow({ emotion, gender }: RecordEmotionRowProps) {
  const quadrant = getEmotionQuadrant(emotion.emotion);
  const label = getEmotionLabel(emotion.emotion, gender);

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border/60">
      <MoodBubble
        quadrant={quadrant}
        tone={3}
        className="size-10 font-display text-sm font-semibold"
      >
        {emotion.intensity}
      </MoodBubble>
      <span className="min-w-0 flex-1 truncate font-semibold">{label}</span>
      <RecordIntensityDots
        quadrant={quadrant}
        intensity={emotion.intensity}
        label={`Intensidad de ${label}`}
      />
    </div>
  );
}
