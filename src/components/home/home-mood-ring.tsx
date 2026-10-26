import { Plus } from "lucide-react";
import Link from "next/link";

import { Face } from "@/components/faces/face";
import type { MoodQuadrant } from "@/db/schema";
import { getMoodStyles } from "@/lib/emotions";
import { getQuadrantFace } from "@/lib/faces";
import { cn } from "@/lib/utils";

type HomeMoodRingProps = {
  todayRecords: { id: string; quadrant: MoodQuadrant | null }[];
};

const RING_MASK =
  "mask-[radial-gradient(farthest-side,transparent_calc(100%-19px),black_calc(100%-18px))]";

function buildMoodGradient(quadrants: (MoodQuadrant | null)[]) {
  const colors = quadrants.map((quadrant) => getMoodStyles(quadrant).color);
  if (colors.length === 1) return colors[0];

  const slot = 360 / colors.length;
  const blend = Math.min(slot * 0.25, 24);
  const stops = colors.flatMap((color, index) => [
    `${color} ${index * slot + blend}deg`,
    `${color} ${(index + 1) * slot - blend}deg`,
  ]);

  return `conic-gradient(${colors.at(-1)} ${-blend}deg, ${stops.join(", ")}, ${colors[0]} ${360 + blend}deg)`;
}

export function HomeMoodRing({ todayRecords }: HomeMoodRingProps) {
  const isEmpty = todayRecords.length === 0;
  const latestRecord = todayRecords.at(-1);

  return (
    <div className="relative mx-auto size-60 sm:size-64">
      <div
        role="img"
        aria-label={
          isEmpty
            ? "Todavía no has registrado cómo te sientes hoy"
            : `${todayRecords.length} ${todayRecords.length === 1 ? "registro" : "registros"} hoy`
        }
        className={cn(
          "absolute inset-0 rounded-full",
          RING_MASK,
          isEmpty
            ? "animate-[spin_24s_linear_infinite] bg-mood-spectrum opacity-35 motion-reduce:animate-none"
            : "animate-in duration-700 fade-in",
        )}
        style={
          isEmpty
            ? undefined
            : {
                background: buildMoodGradient(
                  todayRecords.map((record) => record.quadrant),
                ),
              }
        }
      />
      <Link
        href="/nuevo-registro"
        aria-label="Nuevo registro"
        className="group absolute inset-0 m-auto flex size-20 items-center justify-center rounded-full bg-card text-foreground shadow-xl ring-1 ring-border/60 outline-none transition-transform duration-300 hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-ring/50"
      >
        {latestRecord ? (
          <>
            <Face
              faceId={getQuadrantFace(latestRecord.quadrant)}
              size={96}
              priority
              className="size-16 transition-transform duration-300 group-hover:-rotate-6"
            />
            <span className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-foreground text-background shadow-md">
              <Plus
                className="size-4 transition-transform duration-300 group-hover:rotate-90"
                strokeWidth={3}
                aria-hidden="true"
              />
            </span>
          </>
        ) : (
          <Plus
            className="size-8 transition-transform duration-300 group-hover:rotate-90"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        )}
      </Link>
    </div>
  );
}
