import { Check, Plus } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { MoodBubble } from "@/components/records/mood-bubble";
import type { MoodQuadrant } from "@/db/schema";
import { cn } from "@/lib/utils";

type HomeWeekDayProps = {
  index: number;
  label: string;
  isToday: boolean;
  isFuture: boolean;
  quadrant: MoodQuadrant | null;
  hasRecord: boolean;
};

export function HomeWeekDay({
  index,
  label,
  isToday,
  isFuture,
  quadrant,
  hasRecord,
}: HomeWeekDayProps) {
  return (
    <li
      className="flex flex-col items-center gap-2 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-400 motion-safe:ease-out-quart motion-safe:[animation-delay:var(--week-delay)]"
      style={{ "--week-delay": `${index * 40}ms` } as CSSProperties}
    >
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
          className={cn(
            "size-9 shadow-sm motion-safe:animate-pop-in motion-safe:[animation-delay:calc(var(--week-delay)+120ms)]",
            isToday && "ring-2 ring-foreground ring-offset-2 ring-offset-card",
          )}
        >
          <Check className="size-4" aria-label="Con registro" />
        </MoodBubble>
      ) : isToday ? (
        <Link
          href="/nuevo-registro"
          data-cuelume-tap=""
          aria-label="Registrar hoy"
          className="flex size-9 items-center justify-center rounded-full border-2 border-dashed border-foreground/40 text-foreground outline-none transition-[scale,border-color,background-color] duration-200 ease-spring hover:scale-110 hover:border-foreground hover:bg-foreground/5 active:scale-90 focus-visible:ring-3 focus-visible:ring-ring/50"
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
