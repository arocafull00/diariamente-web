import { motion } from "motion/react";

import type { StoredBodySensation } from "@/db/schema";
import {
  SENSATION_FILLS,
  getSensationFigurePoint,
  getSensationQuadrant,
} from "@/lib/body-sensations";

type BodySensationGlowProps = {
  sensation: StoredBodySensation;
  filterId: string;
};

export function BodySensationGlow({ sensation, filterId }: BodySensationGlowProps) {
  const point = getSensationFigurePoint(sensation);

  if (!point) {
    return null;
  }

  const radius = 14 + (sensation.intensity / 100) * 14;

  return (
    <motion.circle
      cx={point.x}
      cy={point.y}
      initial={{ r: 0, opacity: 0 }}
      animate={{ r: radius, opacity: 0.9 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      filter={`url(#${filterId})`}
      className={SENSATION_FILLS[getSensationQuadrant(sensation)]}
    />
  );
}
