import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PatientRecord } from "@/db/schema";
import { getEmotionColor } from "@/lib/emotions";
import { formatIntensity, INTENSITY_BADGE_COLORS } from "@/lib/intensity";
import { formatRecordDate } from "@/lib/utils-app";

type RecordCardProps = {
  record: PatientRecord;
  href: string;
  showUnseen?: boolean;
};

export function RecordCard({ record, href, showUnseen }: RecordCardProps) {
  const dominantEmotion = [...record.emotions].sort(
    (a, b) => b.intensity - a.intensity,
  )[0];
  const emotionColor = dominantEmotion
    ? getEmotionColor(dominantEmotion.emotion)
    : null;
  const intensityColors = INTENSITY_BADGE_COLORS[record.emotionIntensity];

  return (
    <Link href={href}>
      <Card className="transition-colors hover:bg-secondary/50">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 font-medium">{record.situation}</p>
            {showUnseen && !record.seenAt ? (
              <Badge variant="default">Nuevo</Badge>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {dominantEmotion && emotionColor ? (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: emotionColor.bg,
                  color: emotionColor.text,
                }}
              >
                {dominantEmotion.emotion}
              </span>
            ) : null}
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: intensityColors.bg,
                color: intensityColors.text,
              }}
            >
              {formatIntensity(record.emotionIntensity)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatRecordDate(record.occurredAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
