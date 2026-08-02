import { ArrowUpRight, CalendarDays, StickyNote } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PatientRecord } from "@/db/schema";
import { getEmotionColor } from "@/lib/emotions";
import { formatIntensity, INTENSITY_STYLES } from "@/lib/intensity";
import { cn } from "@/lib/utils";
import { formatRecordDate } from "@/lib/utils-app";

type RecordCardProps = {
  record: PatientRecord;
  href: string;
  showUnseen?: boolean;
  hasNote?: boolean;
};

export function RecordCard({ record, href, showUnseen, hasNote }: RecordCardProps) {
  const dominantEmotion = [...record.emotions].sort(
    (a, b) => b.intensity - a.intensity,
  )[0];
  const emotionColor = dominantEmotion
    ? getEmotionColor(dominantEmotion.emotion)
    : null;
  const intensityStyles = INTENSITY_STYLES[record.emotionIntensity];

  return (
    <Link
      href={href}
      className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full gap-0 py-0 shadow-sm ring-0 transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:shadow-md group-active:translate-y-0 motion-reduce:transform-none">
        <div className={cn("h-1 w-full shrink-0", intensityStyles.accent)} />
        <CardContent className="flex flex-1 flex-col space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
                <CalendarDays className="size-4" aria-hidden="true" />
              </span>
              <time dateTime={new Date(record.occurredAt).toISOString()}>
                {formatRecordDate(record.occurredAt)}
              </time>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {hasNote ? (
                <span
                  className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary"
                  aria-label="Registro con nota"
                >
                  <StickyNote className="size-4" aria-hidden="true" />
                </span>
              ) : null}
              {showUnseen && !record.seenAt ? (
                <Badge className="shrink-0">Nuevo</Badge>
              ) : null}
            </div>
          </div>

          <p className="line-clamp-3 min-h-18 flex-1 text-[0.95rem] leading-6 font-semibold text-pretty sm:text-base">
            {record.situation}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {dominantEmotion && emotionColor ? (
                <span
                  className="inline-block max-w-44 truncate rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: emotionColor.bg,
                    color: emotionColor.text,
                  }}
                >
                  {dominantEmotion.emotion} {dominantEmotion.intensity}/10
                </span>
              ) : null}
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  intensityStyles.badge,
                )}
              >
                Intensidad {formatIntensity(record.emotionIntensity)}
              </span>
            </div>
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            >
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
