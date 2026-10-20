import { PressableLink } from "@/components/motion/pressable-link";
import { MoodBubble } from "@/components/records/mood-bubble";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GrammaticalGender, PatientRecord } from "@/db/schema";
import {
  getDominantEmotion,
  getEmotionLabel,
  getMoodStyles,
  getRecordQuadrant,
} from "@/lib/emotions";
import {
  formatLastActivityLabel,
  getInitials,
  getFullName,
} from "@/lib/utils-app";
import { cn } from "@/lib/utils";

type PatientCardProps = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  grammaticalGender: GrammaticalGender;
  unseenCount: number;
  latestRecord: Pick<PatientRecord, "occurredAt" | "quadrant" | "emotions"> | null;
};

export function PatientCard({
  id,
  firstName,
  lastName,
  avatarUrl,
  grammaticalGender,
  unseenCount,
  latestRecord,
}: PatientCardProps) {
  const hasUnseenRecords = unseenCount > 0;
  const latestQuadrant = latestRecord ? getRecordQuadrant(latestRecord) : null;
  const latestEmotion = latestRecord
    ? getDominantEmotion(latestRecord.emotions)
    : null;

  return (
    <PressableLink
      href={`/pacientes/${id}`}
      className="group block outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative w-full overflow-hidden rounded-3xl bg-card p-4 shadow-sm ring-1 ring-border/60 transition-shadow duration-200 ease-out group-hover:shadow-md">
        {latestRecord ? (
          <MoodBubble
            quadrant={latestQuadrant}
            tone={1}
            className="absolute -top-10 -right-10 size-28 opacity-60 transition-transform duration-500 group-hover:scale-110"
          />
        ) : null}

        <div className="relative flex items-center gap-3">
          <Avatar className="size-11 rounded-xl after:rounded-xl">
            {avatarUrl ? (
              <AvatarImage
                src={avatarUrl}
                alt=""
                className="rounded-xl"
              />
            ) : null}
            <AvatarFallback className="rounded-xl bg-secondary text-sm font-semibold text-primary ring-1 ring-secondary">
              {getInitials(firstName, lastName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {getFullName(firstName, lastName)}
            </p>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              {latestRecord && latestEmotion ? (
                <>
                  <MoodBubble quadrant={latestQuadrant} tone={3} className="size-2.5" />
                  <span className="truncate">
                    <span className={cn("font-semibold", getMoodStyles(latestQuadrant).strong)}>
                      {getEmotionLabel(latestEmotion.emotion, grammaticalGender)}
                    </span>{" "}
                    · {formatLastActivityLabel(latestRecord.occurredAt)}
                  </span>
                </>
              ) : (
                <span>Sin registros todavía</span>
              )}
            </div>
          </div>

          {hasUnseenRecords ? (
            <div className="flex h-8 min-w-8 items-center justify-center rounded-full bg-primary px-2 text-xs font-semibold text-primary-foreground shadow-sm">
              {unseenCount > 99 ? "99+" : unseenCount}
            </div>
          ) : null}
        </div>
      </div>
    </PressableLink>
  );
}
