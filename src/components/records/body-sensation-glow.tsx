import { motion } from "motion/react";

import type { BodySensation } from "@/db/schema";
import {
  BODY_REGIONS,
  SENSATION_FILLS,
  getSensationQuadrant,
  isBodyRegionId,
} from "@/lib/body-sensations";

type BodySensationGlowProps = {
  sensation: BodySensation;
  filterId: string;
};

export function BodySensationGlow({ sensation, filterId }: BodySensationGlowProps) {
  if (!isBodyRegionId(sensation.region)) {
    return null;
  }

  const region = BODY_REGIONS[sensation.region];
  const radius = 14 + (sensation.intensity / 100) * 14;

  return (
    <motion.circle
      cx={region.x}
      cy={region.y}
      initial={{ r: 0, opacity: 0 }}
      animate={{ r: radius, opacity: 0.9 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      filter={`url(#${filterId})`}
      className={SENSATION_FILLS[getSensationQuadrant(sensation)]}
    />
  );
}
