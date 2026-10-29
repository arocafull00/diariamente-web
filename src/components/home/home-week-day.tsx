import { Check, Plus } from "lucide-react";
import Link from "next/link";

import { MoodBubble } from "@/components/records/mood-bubble";
import type { MoodQuadrant } from "@/db/schema";
import { cn } from "@/lib/utils";

type HomeWeekDayProps = {
  label: string;
  isToday: boolean;
  isFuture: boolean;
  quadrant: MoodQuadrant | null;
  hasRecord: boolean;
};

export function HomeWeekDay({
  label,
  isToday,
  isFuture,
  quadrant,
  hasRecord,
}: HomeWeekDayProps) {
  return (
    <li className="flex flex-col items-center gap-2">
      <span
        className={cn(
          "text-xs font-semibold",
          isToday ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      {hasRecord ? (
        <MoodBubble
          quadrant={quadrant}
          tone={3}
          className={cn("size-9 shadow-sm", isToday && "ring-2 ring-foreground ring-offset-2 ring-offset-card")}
        >
          <Check className="size-4" aria-label="Con registro" />
        </MoodBubble>
      ) : isToday ? (
        <Link
          href="/nuevo-registro"
          data-cuelume-tap=""
          data-cuelume-theme="press"
          aria-label="Registrar hoy"
          className="flex size-9 items-center justify-center rounded-full border-2 border-dashed border-foreground/40 text-foreground outline-none transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Plus className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full bg-foreground/5 text-muted-foreground/50",
            isFuture && "opacity-50",
          )}
        >
          {isFuture ? null : <Plus className="size-3.5" aria-label="Sin registro" />}
        </span>
      )}
    </li>
  );
}
