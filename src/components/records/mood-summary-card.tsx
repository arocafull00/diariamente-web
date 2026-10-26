import { Face } from "@/components/faces/face";
import { MoodBubble } from "@/components/records/mood-bubble";
import type { MoodQuadrant } from "@/db/schema";
import { getMoodStyles } from "@/lib/emotions";
import { getQuadrantFace } from "@/lib/faces";
import { cn } from "@/lib/utils";
import { formatRecordDate } from "@/lib/utils-app";

type MoodSummaryCardProps = {
  prefix: string;
  emotion: string;
  quadrant: MoodQuadrant | null;
  tags: string[];
  note: string;
  occurredAt: Date;
  className?: string;
};

export function MoodSummaryCard({
  prefix,
  emotion,
  quadrant,
  tags,
  note,
  occurredAt,
  className,
}: MoodSummaryCardProps) {
  const styles = getMoodStyles(quadrant);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 shadow-sm",
        styles.soft,
        className,
      )}
    >
      <MoodBubble
        quadrant={quadrant}
        tone={3}
        className="absolute -top-8 -right-8 size-32 opacity-80"
      />
      <Face
        faceId={getQuadrantFace(quadrant)}
        size={96}
        className="absolute top-4 right-4 size-16 rotate-6 drop-shadow-sm motion-safe:animate-mood-float"
      />
      <p className="relative pr-16 font-display text-3xl leading-tight font-medium">
        {prefix}
        <br />
        <span className={cn("italic", styles.strong)}>
          {emotion.toLowerCase()}
        </span>
      </p>
      {note ? (
        <p className="relative mt-4 line-clamp-3 text-sm leading-6 text-pretty">
          {note}
        </p>
      ) : null}
      {tags.length > 0 ? (
        <p className="relative mt-3 text-xs font-medium text-muted-foreground">
          {tags.join(" · ")}
        </p>
      ) : null}
      <time
        dateTime={occurredAt.toISOString()}
        className="relative mt-3 block text-xs text-muted-foreground"
      >
        {formatRecordDate(occurredAt)}
      </time>
    </article>
  );
}
