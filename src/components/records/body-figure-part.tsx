import type { BodyFigurePart as BodyFigurePartShape } from "@/lib/body-figures";

type BodyFigurePartProps = {
  part: BodyFigurePartShape;
  paint: string;
};

export function BodyFigurePart({ part, paint }: BodyFigurePartProps) {
  if (part.kind === "ellipse") {
    return (
      <ellipse
        cx={part.cx}
        cy={part.cy}
        rx={part.rx}
        ry={part.ry}
        transform={`rotate(${part.rotate} ${part.cx} ${part.cy})`}
        fill={paint}
      />
    );
  }

  if (part.kind === "stroke") {
    return (
      <path
        d={part.d}
        fill="none"
        stroke={paint}
        strokeWidth={part.width}
        strokeLinecap="round"
      />
    );
  }

  return <path d={part.d} fill={paint} />;
}
