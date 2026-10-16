"use client";

import { PersonStanding } from "lucide-react";
import { motion } from "motion/react";

import { BodyFigure } from "@/components/records/body-figure";
import { BodySensationSummary } from "@/components/records/body-sensation-summary";
import type { BodyFigure as BodyFigureId, BodySensation } from "@/db/schema";
import { isBodyRegionId } from "@/lib/body-sensations";
import { cn } from "@/lib/utils";

type BodySensationsCardProps = {
  figure: BodyFigureId | null;
  sensations: BodySensation[];
  onOpen: () => void;
};

const CARD_CLASS_NAME =
  "relative flex w-full overflow-hidden rounded-3xl bg-card text-left shadow-sm ring-1 ring-border/60 outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function BodySensationsCard({ figure, sensations, onOpen }: BodySensationsCardProps) {
  const focus = sensations.map((sensation) => sensation.region).find(isBodyRegionId);

  if (sensations.length === 0 || !figure) {
    return (
      <motion.button
        type="button"
        onClick={onOpen}
        whileTap={{ scale: 0.98 }}
        className={cn(CARD_CLASS_NAME, "min-h-20 items-center justify-between gap-4 px-5")}
      >
        <span className="text-base font-semibold">Agregar sensaciones físicas</span>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full ring-1 ring-border">
          <PersonStanding className="size-5" aria-hidden="true" />
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileTap={{ scale: 0.98 }}
      aria-label="Editar sensaciones físicas"
      className={cn(CARD_CLASS_NAME, "min-h-28 items-stretch")}
    >
      <span className="relative z-10 flex-1 space-y-2 p-5">
        <span className="block text-xs font-semibold text-muted-foreground">Cuerpo</span>
        <span className="block space-y-2">
          {sensations.map((sensation) => (
            <BodySensationSummary key={sensation.region} sensation={sensation} />
          ))}
        </span>
      </span>
      <BodyFigure
        figure={figure}
        sensations={sensations}
        focusRegion={focus ?? null}
        zoom={2}
        className="w-28 shrink-0 sm:w-36"
      />
    </motion.button>
  );
}
