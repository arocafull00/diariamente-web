import { StickyNote } from "lucide-react";
import { PressableLink } from "@/components/motion/pressable-link";
import { MoodBubble } from "@/components/records/mood-bubble";
import { Badge } from "@/components/ui/badge";
import type { PatientRecord } from "@/db/schema";
import { getContextTags } from "@/lib/context-tags";
import {
  getDominantEmotion,
  getMoodStyles,
  getRecordQuadrant,
} from "@/lib/emotions";
import { cn } from "@/lib/utils";
import { formatOccurrenceTime, formatRecordDate } from "@/lib/utils-app";

type RecordCardProps = {
  record: PatientRecord;
  href: string;
  showUnseen?: boolean;
  hasNote?: boolean;
  compactDate?: boolean;
};

const MAX_TAGS = 3;

export function RecordCard({
  record,
  href,
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
      <article className="flex h-full items-start gap-4 rounded-3xl bg-card p-4 shadow-sm ring-1 ring-border/60 transition-shadow duration-200 ease-out group-hover:shadow-md sm:p-5">
        <MoodBubble
          quadrant={quadrant}
          tone={3}
          className="size-14 font-display text-xl font-semibold transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6"
        >
          {dominant?.intensity}
        </MoodBubble>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate font-display text-lg leading-tight font-medium">
              Me sentí{" "}
              <span className={cn("italic", styles.strong)}>
                {dominant?.emotion.toLowerCase() ?? "así"}
              </span>
            </p>
            <div className="flex shrink-0 items-center gap-1.5">
              {hasNote ? (
                <StickyNote
                  className="size-4 text-primary"
                  aria-label="Registro con nota"
                />
              ) : null}
              {showUnseen && !record.seenAt ? <Badge>Nuevo</Badge> : null}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            <time dateTime={occurredAt.toISOString()}>
              {compactDate
                ? formatOccurrenceTime(occurredAt)
                : formatRecordDate(occurredAt)}
            </time>
            {extraEmotions > 0
              ? ` · +${extraEmotions} ${extraEmotions === 1 ? "emoción" : "emociones"}`
              : null}
          </p>
          {preview ? (
            <p className="line-clamp-2 text-sm leading-6 text-pretty">{preview}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Sin profundizar todavía
            </p>
          )}
          {tags.length > 0 ? (
            <p className="flex flex-wrap gap-1.5 pt-1">
              {tags.slice(0, MAX_TAGS).map((tag) => (
                <span
                  key={tag}
                  className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", styles.soft)}
                >
                  {tag}
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
      </article>
    </PressableLink>
  );
}
