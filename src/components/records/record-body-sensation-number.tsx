import type { CSSProperties } from "react";

import type { StoredBodySensation } from "@/db/schema";
import { getSensationQuadrant } from "@/lib/body-sensations";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type RecordBodySensationNumberProps = {
  sensation: StoredBodySensation;
  index: number;
  className?: string;
  style?: CSSProperties;
};

export function RecordBodySensationNumber({
  sensation,
  index,
  className,
  style,
}: RecordBodySensationNumberProps) {
  const styles = getMoodStyles(getSensationQuadrant(sensation));

  return (
    <span
      aria-hidden="true"
      style={style}
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full bg-card text-[0.625rem] font-semibold shadow-sm ring-2",
        styles.ring,
        styles.strong,
        className,
      )}
    >
      {index + 1}
    </span>
  );
}
