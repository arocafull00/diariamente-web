import { StickyNote } from "lucide-react";
import { Face } from "@/components/faces/face";
import { PressableLink } from "@/components/motion/pressable-link";
import { Badge } from "@/components/ui/badge";
import type { GrammaticalGender, PatientRecord } from "@/db/schema";
import { getContextTagLabel, getContextTags } from "@/lib/context-tags";
import {
  getDominantEmotion,
  getEmotionLabel,
  getMoodStyles,
  getRecordQuadrant,
} from "@/lib/emotions";
import { getQuadrantFace } from "@/lib/faces";
import { cn } from "@/lib/utils";
import { formatOccurrenceTime, formatRecordDate } from "@/lib/utils-app";

type RecordCardProps = {
  record: PatientRecord;
  href: string;
  gender: GrammaticalGender;
  showUnseen?: boolean;
  hasNote?: boolean;
  compactDate?: boolean;
};

const MAX_TAGS = 3;

export function RecordCard({
  record,
  href,
  gender,
  showUnseen = false,
  hasNote = false,
  compactDate = false,
}: RecordCardProps) {
  const dominant = getDominantEmotion(record.emotions);
  const quadrant = getRecordQuadrant(record);
  const styles = getMoodStyles(quadrant);
  const tags = getContextTags(record.context);
  const preview = record.situation || record.thoughts || record.behaviours;
  const occurredAt = new Date(record.occurredAt);
  const extraEmotions = record.emotions.length - 1;

  return (
    <PressableLink
      href={href}
      className="group block h-full rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <article
        className={cn(
          "flex h-full items-center gap-4 rounded-3xl bg-linear-to-r from-card from-40% p-4 shadow-sm ring-1 ring-border/60 transition-shadow duration-200 ease-out group-hover:shadow-md sm:p-5",
          styles.fade,
        )}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1.5">
            <p className={cn("truncate text-sm font-semibold", styles.strong)}>
              {dominant ? getEmotionLabel(dominant.emotion, gender) : "Registro"}
              {extraEmotions > 0 ? (
                <span className="font-medium text-muted-foreground">
                  {` +${extraEmotions}`}
                </span>
              ) : null}
            </p>
            {hasNote ? (
              <StickyNote
                className="size-3.5 shrink-0 text-primary"
                aria-label="Registro con nota"
              />
            ) : null}
            {showUnseen && !record.seenAt ? <Badge>Nuevo</Badge> : null}
          </div>
          {preview ? (
            <p className="line-clamp-2 font-display text-base leading-snug font-medium text-pretty text-foreground">
              {preview}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Sin profundizar todavía
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            <time dateTime={occurredAt.toISOString()}>
              {compactDate
                ? formatOccurrenceTime(occurredAt)
                : formatRecordDate(occurredAt)}
            </time>
          </p>
          {tags.length > 0 ? (
            <p className="flex flex-wrap gap-1.5 pt-1">
              {tags.slice(0, MAX_TAGS).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-card/80 px-2.5 py-0.5 text-xs font-medium text-foreground ring-1 ring-border/60"
                >
                  {getContextTagLabel(tag, gender)}
                </span>
              ))}
              {tags.length > MAX_TAGS ? (
                <span className="px-1 text-xs font-medium text-muted-foreground">
                  +{tags.length - MAX_TAGS}
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
        <span className="relative shrink-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105 motion-safe:group-hover:rotate-6">
          <Face
            faceId={getQuadrantFace(quadrant)}
            size={64}
            className="size-16"
          />
          {dominant ? (
            <span
              className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-card font-display text-sm font-semibold shadow-sm ring-1 ring-border/60"
              aria-label={`Intensidad: ${dominant.intensity} de 10`}
            >
              {dominant.intensity}
            </span>
          ) : null}
        </span>
      </article>
    </PressableLink>
  );
}
