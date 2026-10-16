"use client";

import { motion } from "motion/react";

import { BodyFigure } from "@/components/records/body-figure";
import type { BodyFigure as BodyFigureId } from "@/db/schema";
import { cn } from "@/lib/utils";

type BodyFigureOptionProps = {
  figure: BodyFigureId;
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export function BodyFigureOption({ figure, label, selected, onSelect }: BodyFigureOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onSelect}
      className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-6 rounded-3xl py-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <BodyFigure
        figure={figure}
        sensations={[]}
        className={cn(
          "max-h-96 min-h-0 w-full flex-1 transition-opacity duration-200",
          selected ? "opacity-100" : "opacity-60",
        )}
      />
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full ring-2 transition-colors",
          selected ? "ring-foreground" : "ring-border",
        )}
      >
        {selected ? (
          <motion.span
            layoutId="body-figure-radio"
            className="size-6 rounded-full bg-foreground"
          />
        ) : null}
      </span>
    </button>
  );
}
