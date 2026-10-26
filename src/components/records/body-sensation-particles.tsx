import { motion } from "motion/react";

import { BodySensationParticleRing } from "@/components/records/body-sensation-particle-ring";
import type { StoredBodySensation } from "@/db/schema";
import {
  SENSATION_FILLS,
  getSensationFigurePoint,
  getSensationGlowRadius,
  getSensationQuadrant,
} from "@/lib/body-sensations";
import { SENSATION_PARTICLE_RINGS } from "@/lib/sensation-particles";

type BodySensationParticlesProps = {
  sensation: StoredBodySensation;
};

export function BodySensationParticles({ sensation }: BodySensationParticlesProps) {
  const point = getSensationFigurePoint(sensation);

  if (!point) {
    return null;
  }

  const radius = getSensationGlowRadius(sensation);
  const className = SENSATION_FILLS[getSensationQuadrant(sensation)];

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 16 }}
    >
      {SENSATION_PARTICLE_RINGS.map((ring, index) => (
        <BodySensationParticleRing
          key={index}
          ring={ring}
          center={point}
          radius={radius}
          className={className}
        />
      ))}
    </motion.g>
  );
}
