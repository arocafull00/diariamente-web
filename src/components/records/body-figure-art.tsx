import { BodySensationGlow } from "@/components/records/body-sensation-glow";
import type { StoredBodySensation } from "@/db/schema";
import { BODY_FIGURE_PATH, BODY_FIGURE_VIEWBOX } from "@/lib/body-figures";
import { getSensationKey } from "@/lib/body-sensations";

type BodyFigureArtProps = {
  id: string;
  sensations: StoredBodySensation[];
};

export function BodyFigureArt({ id, sensations }: BodyFigureArtProps) {
  return (
    <>
      <defs>
        <pattern
          id={`${id}-dots`}
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="0.7" className="fill-foreground" />
        </pattern>
        <mask id={`${id}-mask`}>
          <path d={BODY_FIGURE_PATH} fill="white" />
        </mask>
        <filter id={`${id}-blur`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <g mask={`url(#${id}-mask)`}>
        <rect
          width={BODY_FIGURE_VIEWBOX.width}
          height={BODY_FIGURE_VIEWBOX.height}
          className="fill-foreground"
          opacity={0.06}
        />
        {sensations.map((sensation, index) => (
          <BodySensationGlow
            key={getSensationKey(sensation, index)}
            sensation={sensation}
            filterId={`${id}-blur`}
          />
        ))}
        <rect
          width={BODY_FIGURE_VIEWBOX.width}
          height={BODY_FIGURE_VIEWBOX.height}
          fill={`url(#${id}-dots)`}
          opacity={0.55}
        />
      </g>
    </>
  );
}
