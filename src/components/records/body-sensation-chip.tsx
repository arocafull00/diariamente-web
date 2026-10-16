"use client";

import { motion } from "motion/react";

import type { BodySensation } from "@/db/schema";
import {
  BODY_REGIONS,
  getBodyRegionPhrase,
  getSensationPleasantnessLabel,
  getSensationQuadrant,
  getSensationSummary,
  isBodyRegionId,
  type BodyRegionId,
} from "@/lib/body-sensations";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type BodySensationChipProps = {
  sensation: BodySensation;
  project: (x: number, y: number) => { left: string; top: string };
  onSelect: (region: BodyRegionId) => void;
};

function getChipLabel(sensation: BodySensation) {
  if (sensation.tags.length === 0) {
    return getSensationPleasantnessLabel(sensation);
  }

  const extra = sensation.tags.length - 1;

  return extra > 0 ? `${sensation.tags[0]} +${extra}` : sensation.tags[0];
}

export function BodySensationChip({ sensation, project, onSelect }: BodySensationChipProps) {
  if (!isBodyRegionId(sensation.region)) {
    return null;
  }

  const region = sensation.region;
  const point = BODY_REGIONS[region];
  const styles = getMoodStyles(getSensationQuadrant(sensation));

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(region)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      aria-label={`${getBodyRegionPhrase(sensation.region)} ${getSensationSummary(sensation)}`}
      style={project(point.x, point.y)}
      className={cn(
        "absolute z-10 ml-3 -translate-y-1/2 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap shadow-sm ring-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        styles.soft,
        styles.strong,
        styles.ring,
      )}
    >
      {getChipLabel(sensation)}
    </motion.button>
  );
}
