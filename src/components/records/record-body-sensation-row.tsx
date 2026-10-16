import type { BodySensation } from "@/db/schema";
import {
  formatSensationTags,
  getBodyRegionTitle,
  getSensationLabel,
  getSensationQuadrant,
} from "@/lib/body-sensations";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type RecordBodySensationRowProps = {
  sensation: BodySensation;
};

export function RecordBodySensationRow({ sensation }: RecordBodySensationRowProps) {
  const quadrant = getSensationQuadrant(sensation);
  const styles = getMoodStyles(quadrant);

  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span
        className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", styles.tones[3])}
        aria-hidden="true"
      />
      <div className="min-w-0 space-y-0.5">
        <p className="font-semibold">{getBodyRegionTitle(sensation.region)}</p>
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
