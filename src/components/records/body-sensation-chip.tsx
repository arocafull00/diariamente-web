"use client";

import { motion } from "motion/react";

import type { BodySensation } from "@/db/schema";
import {
  BODY_POINT_PHRASE,
  getSensationPleasantnessLabel,
  getSensationQuadrant,
  getSensationSummary,
  toFigurePoint,
} from "@/lib/body-sensations";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type BodySensationChipProps = {
  sensation: BodySensation;
  project: (x: number, y: number) => { left: string; top: string };
  onSelect: (id: string) => void;
};

function getChipLabel(sensation: BodySensation) {
  if (sensation.tags.length === 0) {
    return getSensationPleasantnessLabel(sensation);
  }

  const extra = sensation.tags.length - 1;

  return extra > 0 ? `${sensation.tags[0]} +${extra}` : sensation.tags[0];
}

export function BodySensationChip({ sensation, project, onSelect }: BodySensationChipProps) {
  const point = toFigurePoint(sensation);
  const styles = getMoodStyles(getSensationQuadrant(sensation));

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(sensation.id)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      aria-label={`${BODY_POINT_PHRASE} ${getSensationSummary(sensation)}`}
      style={project(point.x, point.y)}
      className="absolute z-10 -ml-2 flex origin-left -translate-y-1/2 items-center gap-1.5 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span
        className={cn("size-4 shrink-0 rounded-full bg-card shadow-sm ring-4", styles.ring)}
        aria-hidden="true"
      />
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap shadow-sm ring-1",
          styles.soft,
          styles.strong,
          styles.ring,
        )}
      >
        {getChipLabel(sensation)}
      </span>
    </motion.button>
  );
}
