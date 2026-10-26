import { useId } from "react";

import { BodyFigureArt } from "@/components/records/body-figure-art";
import { RecordBodyFigureMarker } from "@/components/records/record-body-figure-marker";
import type { BodySide, StoredBodySensation } from "@/db/schema";
import { BODY_FIGURE_VIEWBOX } from "@/lib/body-figures";
import { BODY_SIDE_LABELS, getSensationKey, getSensationSide } from "@/lib/body-sensations";

type RecordBodyFigureProps = {
  side: BodySide;
  sensations: StoredBodySensation[];
};

export function RecordBodyFigure({ side, sensations }: RecordBodyFigureProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const visible = sensations.filter((sensation) => getSensationSide(sensation) === side);

  return (
    <figure className="flex shrink-0 flex-col items-center gap-2">
      <div className="relative aspect-[10/21] h-72">
        <svg
          viewBox={`0 0 ${BODY_FIGURE_VIEWBOX.width} ${BODY_FIGURE_VIEWBOX.height}`}
          className="absolute inset-0 size-full"
          aria-hidden="true"
        >
          <BodyFigureArt id={id} side={side} sensations={visible} />
        </svg>
        {sensations.map((sensation, index) =>
          getSensationSide(sensation) === side ? (
            <RecordBodyFigureMarker
              key={getSensationKey(sensation, index)}
              sensation={sensation}
              index={index}
            />
          ) : null,
        )}
      </div>
      <figcaption className="text-xs font-semibold text-muted-foreground">
        {BODY_SIDE_LABELS[side]}
      </figcaption>
    </figure>
  );
}
