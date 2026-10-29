import Link from "next/link";

import { MoodBubble } from "@/components/records/mood-bubble";
import type { GrammaticalGender, RecordEmotion } from "@/db/schema";
import { getEmotionLabel, getEmotionQuadrant } from "@/lib/emotions";
import { formatRecordDate } from "@/lib/utils-app";

type PatientSessionPeakItemProps = {
  recordId: string;
  emotion: RecordEmotion;
  occurredAt: Date;
  gender: GrammaticalGender;
};

export function PatientSessionPeakItem({
  recordId,
  emotion,
  occurredAt,
  gender,
}: PatientSessionPeakItemProps) {
  return (
    <li>
      <Link
        href={`/registro/${recordId}`}
        data-cuelume-tap="type"
        className="-mx-2 flex items-center gap-3 rounded-2xl p-2 outline-none transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-muted"
      >
        <MoodBubble
          quadrant={getEmotionQuadrant(emotion.emotion)}
          tone={3}
          className="size-8 font-display text-xs font-semibold"
        >
          {emotion.intensity}
        </MoodBubble>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {getEmotionLabel(emotion.emotion, gender)}
        </span>
        <time
          dateTime={occurredAt.toISOString()}
          className="shrink-0 text-xs text-muted-foreground"
        >
          {formatRecordDate(occurredAt)}
        </time>
      </Link>
    </li>
  );
}
