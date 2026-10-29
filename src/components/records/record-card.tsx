import { StickyNote } from "lucide-react";
import { PressableLink } from "@/components/motion/pressable-link";
import { MoodBubble } from "@/components/records/mood-bubble";
import { Badge } from "@/components/ui/badge";
import type { GrammaticalGender, PatientRecord } from "@/db/schema";
import { getContextTagLabel, getContextTags } from "@/lib/context-tags";
import { CIRCLE_CLIP_PATH, getEmotionShape } from "@/lib/emotion-shapes";
import {
  getDominantEmotion,
  getEmotionLabel,
  getMoodStyles,
  getRecordQuadrant,
} from "@/lib/emotions";
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
  const clipPath = dominant
    ? getEmotionShape(dominant.emotion).clipPath
    : CIRCLE_CLIP_PATH;

  return (
    <PressableLink
      href={href}
      data-cuelume-tap="type"
      data-cuelume-theme="mech"
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
        <span
          className="shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6"
          style={{ clipPath }}
        >
          <MoodBubble
            quadrant={quadrant}
            tone={3}
            className="size-16 font-display text-xl font-semibold"
          >
            {dominant?.intensity}
          </MoodBubble>
        </span>
      </article>
    </PressableLink>
  );
}
