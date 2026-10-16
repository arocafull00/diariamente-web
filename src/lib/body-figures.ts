import type { BodyFigure } from "@/db/schema";

export type BodyFigurePart =
  | { kind: "fill"; d: string }
  | { kind: "stroke"; d: string; width: number }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number; rotate: number };

export const BODY_FIGURE_VIEWBOX = { width: 200, height: 420 };

export const BODY_FIGURE_OPTIONS: { id: BodyFigure; label: string }[] = [
  { id: "masculine", label: "Figura masculina" },
  { id: "feminine", label: "Figura femenina" },
];

function mirrorPath(d: string) {
  return d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) =>
    `${BODY_FIGURE_VIEWBOX.width - Number(x)} ${y}`,
  );
}

function symmetric(parts: BodyFigurePart[]): BodyFigurePart[] {
  return parts.flatMap<BodyFigurePart>((part) => {
    if (part.kind === "ellipse") {
      return [
        part,
        { ...part, cx: BODY_FIGURE_VIEWBOX.width - part.cx, rotate: -part.rotate },
      ];
    }

    return [part, { ...part, d: mirrorPath(part.d) }];
  });
}

export const BODY_FIGURES: Record<BodyFigure, BodyFigurePart[]> = {
  masculine: [
    { kind: "ellipse", cx: 100, cy: 34, rx: 16, ry: 20, rotate: 0 },
    { kind: "stroke", d: "M100 50 L100 72", width: 17 },
    {
      kind: "fill",
      d: "M74 74 C86 70 114 70 126 74 C138 78 142 86 140 100 C138 120 134 140 131 160 C129 176 129 192 131 206 C133 216 130 226 120 230 C112 233 104 234 100 234 C96 234 88 233 80 230 C70 226 67 216 69 206 C71 192 71 176 69 160 C66 140 62 120 60 100 C58 86 62 78 74 74 Z",
    },
    ...symmetric([
      { kind: "stroke", d: "M66 86 C58 110 50 136 45 160", width: 19 },
      { kind: "stroke", d: "M45 160 C40 182 33 204 27 226", width: 15 },
      { kind: "ellipse", cx: 23, cy: 240, rx: 7.5, ry: 13, rotate: 18 },
      { kind: "stroke", d: "M88 218 C86 252 84 284 83 312", width: 30 },
      { kind: "stroke", d: "M83 312 C82 342 82 370 82 394", width: 20 },
      { kind: "ellipse", cx: 81, cy: 404, rx: 10, ry: 8, rotate: 0 },
    ]),
  ],
  feminine: [
    { kind: "ellipse", cx: 100, cy: 36, rx: 15, ry: 19, rotate: 0 },
    { kind: "stroke", d: "M100 52 L100 74", width: 14 },
    {
      kind: "fill",
      d: "M78 76 C88 72 112 72 122 76 C132 80 136 88 134 100 C132 118 126 140 121 160 C118 174 124 192 132 208 C136 216 134 226 124 231 C114 235 106 236 100 236 C94 236 86 235 76 231 C66 226 64 216 68 208 C76 192 82 174 79 160 C74 140 68 118 66 100 C64 88 68 80 78 76 Z",
    },
    ...symmetric([
      { kind: "stroke", d: "M70 88 C62 112 55 136 50 160", width: 15 },
      { kind: "stroke", d: "M50 160 C45 182 38 204 32 226", width: 12 },
      { kind: "ellipse", cx: 28, cy: 239, rx: 6.5, ry: 12, rotate: 18 },
      { kind: "stroke", d: "M86 220 C85 252 85 284 85 314", width: 28 },
      { kind: "stroke", d: "M85 314 C84 344 85 370 86 396", width: 17 },
      { kind: "ellipse", cx: 86, cy: 405, rx: 8.5, ry: 7, rotate: 0 },
    ]),
  ],
};
