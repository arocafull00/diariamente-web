const POINTS = 60;

type RadiusFn = (angle: number) => number;

export type EmotionShape = {
  clipPath: string;
  rotate: number;
  scale: number;
  stiffness: number;
  damping: number;
};

function triangleWave(value: number) {
  const t = value / (2 * Math.PI) - Math.floor(value / (2 * Math.PI));
  return 1 - 4 * Math.abs(t - 0.5);
}

function superellipse(n: number): RadiusFn {
  const max = Math.pow(2 * Math.pow(Math.SQRT1_2, n), -1 / n);
  return (angle) =>
    Math.pow(
      Math.pow(Math.abs(Math.cos(angle)), n) + Math.pow(Math.abs(Math.sin(angle)), n),
      -1 / n,
    ) / Math.max(max, 1);
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
    clipPath: toPolygon((a) => 0.8 + 0.2 * Math.cos(6 * a)),
    rotate: 30,
    scale: 1.28,
    stiffness: 260,
    damping: 12,
  },
  {
    clipPath: toPolygon((a) => 0.55 + 0.45 * Math.pow(Math.abs(Math.cos(2.5 * a)), 4)),
    rotate: -18,
    scale: 1.34,
    stiffness: 320,
    damping: 14,
  },
  {
    clipPath: toPolygon((a) => 0.82 + 0.18 * triangleWave(10 * a)),
    rotate: 45,
    scale: 1.26,
    stiffness: 200,
    damping: 10,
  },
  {
    clipPath: toPolygon(superellipse(5)),
    rotate: 12,
    scale: 1.22,
    stiffness: 300,
    damping: 18,
  },
  {
    clipPath: toPolygon(superellipse(0.75)),
    rotate: 0,
    scale: 1.38,
    stiffness: 340,
    damping: 15,
  },
  {
    clipPath: toPolygon((a) => 0.86 + 0.09 * Math.sin(3 * a) + 0.05 * Math.cos(5 * a)),
    rotate: -24,
    scale: 1.24,
    stiffness: 180,
    damping: 9,
  },
  {
    clipPath: toPolygon((a) => {
      const wedge = Math.abs(Math.atan2(Math.sin(a), Math.cos(a)));
      return wedge < 0.5 ? 0.12 + wedge * 1.4 : 1;
    }),
    rotate: -30,
    scale: 1.24,
    stiffness: 280,
    damping: 13,
  },
  {
    clipPath: toPolygon((a) => 0.78 + 0.22 * Math.cos(3 * a)),
    rotate: -90,
    scale: 1.3,
    stiffness: 240,
    damping: 12,
  },
  {
    clipPath: toPolygon((a) => 0.7 + 0.3 * Math.pow(Math.abs(Math.cos(2 * a)), 0.6)),
    rotate: 22,
    scale: 1.3,
    stiffness: 260,
    damping: 16,
  },
  {
    clipPath: toPolygon((a) => 0.88 + 0.12 * Math.sign(Math.sin(8 * a)) * Math.pow(Math.abs(Math.sin(8 * a)), 0.3)),
    rotate: 15,
    scale: 1.26,
    stiffness: 220,
    damping: 11,
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
