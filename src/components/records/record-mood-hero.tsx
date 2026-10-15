import { CalendarDays } from "lucide-react";

import { MoodBubble } from "@/components/records/mood-bubble";
import { RecordIntensityDots } from "@/components/records/record-intensity-dots";
import type { MoodQuadrant, RecordEmotion } from "@/db/schema";
import { findEmotion, getMoodStyles, getQuadrantLabel } from "@/lib/emotions";
import { cn } from "@/lib/utils";
import { formatRecordDate } from "@/lib/utils-app";

type RecordMoodHeroProps = {
  emotion: RecordEmotion | null;
  quadrant: MoodQuadrant | null;
  occurredAt: Date;
};

export function RecordMoodHero({ emotion, quadrant, occurredAt }: RecordMoodHeroProps) {
  const styles = getMoodStyles(quadrant);
  const definition = emotion ? findEmotion(emotion.emotion)?.definition : null;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] p-6 shadow-sm sm:p-8",
        styles.soft,
      )}
    >
      <MoodBubble
        quadrant={quadrant}
        tone={1}
        className="absolute -top-16 -right-16 size-56 animate-in opacity-70 duration-700 zoom-in-50 fade-in"
      />
      <MoodBubble
        quadrant={quadrant}
        tone={3}
        className="absolute top-10 right-10 size-20 animate-in font-display text-3xl font-semibold duration-700 zoom-in-50 fade-in sm:size-24"
      >
        {emotion?.intensity}
      </MoodBubble>

      <div className="relative max-w-[calc(100%-7rem)] space-y-1">
        {quadrant ? (
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {getQuadrantLabel(quadrant)}
          </p>
        ) : null}
        <h2 className="font-display text-4xl leading-tight font-medium text-balance sm:text-5xl">
          Me sentí{" "}
          <span className={cn("italic", styles.strong)}>
            {emotion?.emotion.toLowerCase() ?? "así"}
          </span>
        </h2>
        {definition ? (
          <p className="pt-1 text-sm leading-6 text-pretty">{definition}</p>
        ) : null}
      </div>

      <div className="relative mt-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Intensidad</p>
          <RecordIntensityDots
            quadrant={quadrant}
            intensity={emotion?.intensity ?? 0}
            label="Intensidad de la emoción principal"
          />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-4" aria-hidden="true" />
          <time dateTime={occurredAt.toISOString()}>{formatRecordDate(occurredAt)}</time>
        </p>
      </div>
    </section>
  );
}
