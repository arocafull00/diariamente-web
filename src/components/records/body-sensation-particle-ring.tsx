import { motion } from "motion/react";

import type { FigurePoint } from "@/lib/body-sensations";
import type { SensationParticleRing } from "@/lib/sensation-particles";

type BodySensationParticleRingProps = {
  ring: SensationParticleRing;
  center: FigurePoint;
  radius: number;
  className: string;
};

export function BodySensationParticleRing({
  ring,
  center,
  radius,
  className,
}: BodySensationParticleRingProps) {
  return (
    <motion.g
      animate={{ rotate: 360 * ring.direction }}
      transition={{ duration: ring.duration, ease: "linear", repeat: Infinity }}
    >
      <circle cx={center.x} cy={center.y} r={radius * 1.1} fill="transparent" />
      {ring.particles.map((particle, index) => (
        <circle
          key={index}
          cx={center.x + particle.x * radius}
          cy={center.y + particle.y * radius}
          r={particle.r}
          opacity={particle.opacity}
          className={className}
        />
      ))}
    </motion.g>
  );
}
