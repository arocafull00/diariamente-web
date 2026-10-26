import type { BodySide } from "@/db/schema";

type BodyFigureSideCuesProps = {
  side: BodySide;
};

const STROKE_PROPS = {
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeOpacity: 0.3,
  className: "stroke-foreground",
} as const;

export function BodyFigureSideCues({ side }: BodyFigureSideCuesProps) {
  if (side === "back") {
    return (
      <>
        <path
          d="M82 37 C82 22 89 12 100 12 C111 12 118 22 118 37 C118 46 116 52 113 57 C108 53 92 53 87 57 C84 52 82 46 82 37 Z"
          className="fill-foreground"
          opacity={0.14}
        />
        <path d="M100 74 L100 200" strokeDasharray="0.5 5" {...STROKE_PROPS} />
        <path d="M80 98 Q84 116 94 121 M120 98 Q116 116 106 121" {...STROKE_PROPS} />
      </>
    );
  }

  return (
    <>
      <circle cx={94} cy={37} r={1.8} className="fill-foreground" opacity={0.35} />
      <circle cx={106} cy={37} r={1.8} className="fill-foreground" opacity={0.35} />
      <path d="M85 85 Q92 89 98 87 M102 87 Q108 89 115 85" {...STROKE_PROPS} />
    </>
  );
}
