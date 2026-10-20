import { useId } from "react";

import { BodyFigureArt } from "@/components/records/body-figure-art";
import { RecordBodyFigureMarker } from "@/components/records/record-body-figure-marker";
import type { StoredBodySensation } from "@/db/schema";
import { BODY_FIGURE_VIEWBOX } from "@/lib/body-figures";
import { getSensationKey } from "@/lib/body-sensations";

type RecordBodyFigureProps = {
  sensations: StoredBodySensation[];
};

export function RecordBodyFigure({ sensations }: RecordBodyFigureProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <div className="relative mx-auto aspect-[10/21] h-72 shrink-0">
      <svg
        viewBox={`0 0 ${BODY_FIGURE_VIEWBOX.width} ${BODY_FIGURE_VIEWBOX.height}`}
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <BodyFigureArt id={id} sensations={sensations} />
      </svg>
      {sensations.map((sensation, index) => (
        <RecordBodyFigureMarker
          key={getSensationKey(sensation, index)}
          sensation={sensation}
          index={index}
        />
      ))}
    </div>
  );
}
