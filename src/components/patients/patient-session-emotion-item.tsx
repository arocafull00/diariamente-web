import { MoodBubble } from "@/components/records/mood-bubble";
import type { GrammaticalGender } from "@/db/schema";
import { getEmotionLabel, getEmotionQuadrant } from "@/lib/emotions";

type PatientSessionEmotionItemProps = {
  emotion: string;
  count: number;
  gender: GrammaticalGender;
};

export function PatientSessionEmotionItem({
  emotion,
  count,
  gender,
}: PatientSessionEmotionItemProps) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <MoodBubble
        quadrant={getEmotionQuadrant(emotion)}
        tone={3}
        className="size-3.5"
      />
      <span className="min-w-0 flex-1 truncate font-medium">
        {getEmotionLabel(emotion, gender)}
      </span>
      <span className="text-xs font-semibold text-muted-foreground tabular-nums">
        {count}
      </span>
    </li>
  );
}
