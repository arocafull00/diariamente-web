import { CalendarDays } from "lucide-react";

import { Face } from "@/components/faces/face";
import { MoodBubble } from "@/components/records/mood-bubble";
import { RecordIntensityDots } from "@/components/records/record-intensity-dots";
import type {
  GrammaticalGender,
  MoodQuadrant,
  RecordEmotion,
} from "@/db/schema";
import {
  findEmotion,
  getEmotionDefinition,
  getEmotionLabel,
  getMoodStyles,
  getQuadrantLabel,
} from "@/lib/emotions";
import { getQuadrantFace } from "@/lib/faces";
import { cn } from "@/lib/utils";
import { formatRecordDate } from "@/lib/utils-app";

type RecordMoodHeroProps = {
  emotion: RecordEmotion | null;
  quadrant: MoodQuadrant | null;
  occurredAt: Date;
  gender: GrammaticalGender;
  action?: React.ReactNode;
};

export function RecordMoodHero({
  emotion,
  quadrant,
  occurredAt,
  gender,
  action,
}: RecordMoodHeroProps) {
  const styles = getMoodStyles(quadrant);
  const definedEmotion = emotion ? findEmotion(emotion.emotion) : null;
  const definition = definedEmotion
    ? getEmotionDefinition(definedEmotion, gender)
    : null;

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
      <div className="absolute top-10 right-10 size-20 animate-in duration-700 zoom-in-50 fade-in sm:size-24">
        <Face
          faceId={getQuadrantFace(quadrant)}
          size={96}
          priority
          className="size-full drop-shadow-sm motion-safe:animate-mood-float"
        />
        {emotion ? (
          <span className="absolute -right-1 -bottom-1 flex size-9 items-center justify-center rounded-full bg-card font-display text-lg font-semibold shadow-sm ring-1 ring-border/60">
            {emotion.intensity}
          </span>
        ) : null}
      </div>

      <div className="relative max-w-[calc(100%-7rem)] space-y-1">
        {quadrant ? (
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {getQuadrantLabel(quadrant)}
          </p>
        ) : null}
        <h2 className="font-display text-4xl leading-tight font-medium text-balance sm:text-5xl">
          Me sentí{" "}
          <span className={cn("italic", styles.strong)}>
            {emotion
              ? getEmotionLabel(emotion.emotion, gender).toLowerCase()
              : "así"}
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
      {action ? <div className="relative mt-5 flex justify-end">{action}</div> : null}
    </section>
  );
}
