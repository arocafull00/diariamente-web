type SensationParticle = { x: number; y: number; r: number; opacity: number };

export type SensationParticleRing = {
  duration: number;
  direction: 1 | -1;
  particles: SensationParticle[];
};

const RING_SPECS = [
  { from: 0.08, to: 0.45, count: 16, duration: 7, direction: 1 },
  { from: 0.45, to: 0.75, count: 26, duration: 11, direction: -1 },
  { from: 0.75, to: 1.05, count: 36, duration: 16, direction: 1 },
] as const;

function seeded(index: number) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export const SENSATION_PARTICLE_RINGS: SensationParticleRing[] = RING_SPECS.map(
  ({ from, to, count, duration, direction }, ringIndex) => ({
    duration,
    direction,
    particles: Array.from({ length: count }, (_, index) => {
      const base = ringIndex * 1000 + index * 4;
      const angle = seeded(base) * Math.PI * 2;
      const distance = Math.sqrt(from * from + seeded(base + 1) * (to * to - from * from));

      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        r: 0.55 + seeded(base + 2) * 0.45,
        opacity: 0.45 + seeded(base + 3) * 0.55,
      };
    }),
  }),
);
