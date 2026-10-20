import { RecordBodySensationNumber } from "@/components/records/record-body-sensation-number";
import type { StoredBodySensation } from "@/db/schema";
import { BODY_FIGURE_VIEWBOX } from "@/lib/body-figures";
import { getSensationFigurePoint } from "@/lib/body-sensations";

type RecordBodyFigureMarkerProps = {
  sensation: StoredBodySensation;
  index: number;
};

export function RecordBodyFigureMarker({ sensation, index }: RecordBodyFigureMarkerProps) {
  const point = getSensationFigurePoint(sensation);

  if (!point) {
    return null;
  }

  return (
    <RecordBodySensationNumber
      sensation={sensation}
      index={index}
      className="absolute -translate-1/2"
      style={{
        left: `${(point.x / BODY_FIGURE_VIEWBOX.width) * 100}%`,
        top: `${(point.y / BODY_FIGURE_VIEWBOX.height) * 100}%`,
      }}
    />
  );
}
