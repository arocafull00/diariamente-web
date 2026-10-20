import { RecordBodySensationNumber } from "@/components/records/record-body-sensation-number";
import type { StoredBodySensation } from "@/db/schema";
import {
  formatSensationTags,
  getSensationLabel,
  getSensationQuadrant,
  getSensationTitle,
} from "@/lib/body-sensations";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type RecordBodySensationRowProps = {
  sensation: StoredBodySensation;
  index: number;
};

export function RecordBodySensationRow({ sensation, index }: RecordBodySensationRowProps) {
  const quadrant = getSensationQuadrant(sensation);
  const styles = getMoodStyles(quadrant);

  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <RecordBodySensationNumber sensation={sensation} index={index} />
      <div className="min-w-0 space-y-0.5">
        <p className="font-semibold">{getSensationTitle(sensation, index)}</p>
        {sensation.tags.length > 0 ? (
          <p className={cn("text-sm font-medium", styles.strong)}>
            {formatSensationTags(sensation.tags)}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">{getSensationLabel(sensation)}</p>
      </div>
    </li>
  );
}
