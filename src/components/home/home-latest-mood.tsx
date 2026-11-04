import { ArrowUpRight } from "lucide-react";

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
        <span
          className="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-[translate,scale] duration-300 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </PressableLink>
    </section>
  );
}
