import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { MoodSummaryCard } from "@/components/records/mood-summary-card";
import type { PatientRecord } from "@/db/schema";
import { getContextTags } from "@/lib/context-tags";
import { getDominantEmotion, getRecordQuadrant } from "@/lib/emotions";

type HomeLatestMoodProps = {
  record: PatientRecord;
};

export function HomeLatestMood({ record }: HomeLatestMoodProps) {
  const dominant = getDominantEmotion(record.emotions);

  return (
    <section className="space-y-3">
      <h2 className="px-1 font-semibold">Tu último registro</h2>
      <Link
        href={`/registro/${record.id}`}
        className="group relative block rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <MoodSummaryCard
          prefix="Me sentí"
          emotion={dominant?.emotion ?? "así"}
          quadrant={getRecordQuadrant(record)}
          tags={getContextTags(record.context)}
          note={record.situation}
          occurredAt={new Date(record.occurredAt)}
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md"
        />
        <span
          className="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </Link>
    </section>
  );
}
