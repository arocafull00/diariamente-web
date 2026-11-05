import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { MoodBubble } from "@/components/records/mood-bubble";
import { SheetClose } from "@/components/ui/sheet";
import type { GrammaticalGender } from "@/db/schema";
import { getEmotionLabel, getEmotionQuadrant } from "@/lib/emotions";
import { getRecordFiltersHref } from "@/lib/record-filters";

type PatientSessionEmotionItemProps = {
  patientId: string;
  emotion: string;
  count: number;
  gender: GrammaticalGender;
};

export function PatientSessionEmotionItem({
  patientId,
  emotion,
  count,
  gender,
}: PatientSessionEmotionItemProps) {
  const href = `${getRecordFiltersHref(`/pacientes/${patientId}`, {
    emotions: [emotion],
    page: 1,
  })}#registros`;
  const label = getEmotionLabel(emotion, gender);

  return (
    <li>
      <SheetClose
        nativeButton={false}
        render={<Link href={href} />}
        aria-label={`Ver registros con ${label}`}
        className="group/emotion -mx-2 flex items-center gap-3 rounded-2xl p-2 outline-none transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-muted"
      >
        <MoodBubble
          quadrant={getEmotionQuadrant(emotion)}
          tone={3}
          className="size-8 font-display text-xs font-semibold tabular-nums"
        >
          {count}
        </MoodBubble>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {label}
        </span>
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground/60 transition-[translate,color] duration-200 ease-spring group-hover/emotion:translate-x-0.5 group-hover/emotion:text-muted-foreground"
          aria-hidden="true"
        />
      </SheetClose>
    </li>
  );
}
