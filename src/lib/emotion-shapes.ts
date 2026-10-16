const POINTS = 60;

type RadiusFn = (angle: number) => number;

type Lobe = {
  frequency: number;
  amplitude: number;
  phase: number;
};

export type EmotionShape = {
  clipPath: string;
  rotate: number;
  scale: number;
  stiffness: number;
  damping: number;
};

function blob(lobes: Lobe[]): RadiusFn {
  const base = 1 - lobes.reduce((sum, lobe) => sum + lobe.amplitude, 0);
  return (angle) =>
    lobes.reduce(
      (radius, lobe) => radius + lobe.amplitude * Math.cos(lobe.frequency * angle + lobe.phase),
      base,
    );
}

function toPolygon(radius: RadiusFn) {
  const points = Array.from({ length: POINTS }, (_, index) => {
    const angle = (index / POINTS) * Math.PI * 2;
    const r = Math.min(Math.max(radius(angle), 0.05), 1) * 50;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
  });

  return `polygon(${points.join(", ")})`;
}

export const CIRCLE_CLIP_PATH = toPolygon(() => 1);

const SHAPES: EmotionShape[] = [
  {
    clipPath: toPolygon(blob([{ frequency: 2, amplitude: 0.05, phase: 0 }, { frequency: 3, amplitude: 0.02, phase: 1 }])),
    rotate: 8,
    scale: 1.14,
    stiffness: 220,
    damping: 16,
  },
  {
    clipPath: toPolygon(blob([{ frequency: 3, amplitude: 0.04, phase: 0.6 }, { frequency: 2, amplitude: 0.03, phase: 2 }])),
    rotate: -10,
    scale: 1.16,
    stiffness: 200,
    damping: 15,
  },
  {
    clipPath: toPolygon(blob([{ frequency: 2, amplitude: 0.06, phase: 1.2 }])),
    rotate: 14,
    scale: 1.12,
    stiffness: 240,
    damping: 18,
  },
  {
    clipPath: toPolygon(blob([{ frequency: 4, amplitude: 0.025, phase: 0 }, { frequency: 2, amplitude: 0.04, phase: 0.4 }])),
    rotate: -6,
    scale: 1.15,
    stiffness: 210,
    damping: 15,
  },
  {
    clipPath: toPolygon(blob([{ frequency: 3, amplitude: 0.05, phase: 2.4 }, { frequency: 1, amplitude: 0.02, phase: 0 }])),
    rotate: 12,
    scale: 1.14,
    stiffness: 190,
    damping: 14,
  },
  {
    clipPath: toPolygon(blob([{ frequency: 2, amplitude: 0.035, phase: 2.8 }, { frequency: 5, amplitude: 0.015, phase: 1 }])),
    rotate: -12,
    scale: 1.16,
    stiffness: 230,
    damping: 17,
  },
];

function hash(value: string) {
  let result = 0;

  for (const char of value) {
    result = (result * 31 + char.charCodeAt(0)) >>> 0;
  }

  return result;
}

export function getEmotionShape(name: string) {
  return SHAPES[hash(name) % SHAPES.length];
}
