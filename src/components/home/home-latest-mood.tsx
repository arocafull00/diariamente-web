import { PressableLink } from "@/components/motion/pressable-link";
import { MoodSummaryCard } from "@/components/records/mood-summary-card";
import type { GrammaticalGender, PatientRecord } from "@/db/schema";
import { getContextTagLabel, getContextTags } from "@/lib/context-tags";
import {
  getDominantEmotion,
  getEmotionLabel,
  getRecordQuadrant,
} from "@/lib/emotions";

type HomeLatestMoodProps = {
  record: PatientRecord;
  gender: GrammaticalGender;
};

export function HomeLatestMood({ record, gender }: HomeLatestMoodProps) {
  const dominant = getDominantEmotion(record.emotions);

  return (
    <section className="space-y-3">
      <h2 className="px-1 font-semibold">Tu último registro</h2>
      <PressableLink
        href={`/registro/${record.id}`}
        className="group relative block rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <MoodSummaryCard
          prefix="Me sentí"
          emotion={dominant ? getEmotionLabel(dominant.emotion, gender) : "así"}
          quadrant={getRecordQuadrant(record)}
          tags={getContextTags(record.context).map((tag) =>
            getContextTagLabel(tag, gender),
          )}
          note={record.situation}
          occurredAt={new Date(record.occurredAt)}
          className="transition-shadow duration-300 group-hover:shadow-md"
        />
      </PressableLink>
    </section>
  );
}
