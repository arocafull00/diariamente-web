import { Plus } from "lucide-react";
import Link from "next/link";

import { HomeMoodRingSegment } from "@/components/home/home-mood-ring-segment";
import type { MoodQuadrant } from "@/db/schema";
import { cn } from "@/lib/utils";

type HomeMoodRingProps = {
  todayRecords: { id: string; quadrant: MoodQuadrant | null }[];
};

const RADIUS = 100;

export function HomeMoodRing({ todayRecords }: HomeMoodRingProps) {
  const isEmpty = todayRecords.length === 0;

  return (
    <div className="relative mx-auto size-60 sm:size-64">
      <div
        className={cn(
          "absolute inset-0 animate-[spin_24s_linear_infinite] rounded-full bg-mood-spectrum mask-[radial-gradient(farthest-side,transparent_calc(100%-19px),black_calc(100%-18px))] motion-reduce:animate-none",
          isEmpty ? "opacity-35" : "opacity-0",
        )}
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 240 240"
        className="absolute inset-0 -rotate-90"
        role="img"
        aria-label={
          isEmpty
            ? "Todavía no has registrado cómo te sientes hoy"
            : `${todayRecords.length} ${todayRecords.length === 1 ? "registro" : "registros"} hoy`
        }
      >
        {isEmpty ? null : (
          <circle
            cx="120"
            cy="120"
            r={RADIUS}
            fill="none"
            strokeWidth="18"
            className="stroke-foreground/5"
          />
        )}
        {todayRecords.map((record, index) => (
          <HomeMoodRingSegment
            key={record.id}
            quadrant={record.quadrant}
            index={index}
            total={todayRecords.length}
            radius={RADIUS}
            delay={index * 120}
          />
        ))}
      </svg>
      <Link
        href="/nuevo-registro"
        aria-label="Nuevo registro"
        className="group absolute inset-0 m-auto flex size-20 items-center justify-center rounded-full bg-card text-foreground shadow-xl ring-1 ring-border/60 outline-none transition-transform duration-300 hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-ring/50"
      >
        <Plus
          className="size-8 transition-transform duration-300 group-hover:rotate-90"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
