import type { BodySensation } from "@/db/schema";
import {
  getBodyRegionPhrase,
  getSensationQuadrant,
  getSensationSummary,
} from "@/lib/body-sensations";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type BodySensationSummaryProps = {
  sensation: BodySensation;
};

export function BodySensationSummary({ sensation }: BodySensationSummaryProps) {
  const styles = getMoodStyles(getSensationQuadrant(sensation));

  return (
    <span className="block text-sm leading-snug">
      <span className="block font-medium text-foreground">
        {getBodyRegionPhrase(sensation.region)}
      </span>
      <span className={cn("block font-semibold", styles.strong)}>
        {getSensationSummary(sensation)}
      </span>
    </span>
  );
}
