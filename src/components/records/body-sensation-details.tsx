"use client";

import { SensationPadDots } from "@/components/records/sensation-pad-dots";
import { SensationTagPicker } from "@/components/records/sensation-tag-picker";
import { Button } from "@/components/ui/button";
import {
  getSensationLabel,
  getSensationQuadrant,
  getSensationTagOptions,
  type SensationValue,
} from "@/lib/body-sensations";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type BodySensationDetailsProps = {
  value: SensationValue;
  tags: string[];
  onToggleTag: (tag: string) => void;
  onEditValue: () => void;
  onContinue: () => void;
};

export function BodySensationDetails({
  value,
  tags,
  onToggleTag,
  onEditValue,
  onContinue,
}: BodySensationDetailsProps) {
  const quadrant = getSensationQuadrant(value);
  const styles = getMoodStyles(quadrant);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className={cn("font-display text-2xl font-medium", styles.strong)}>
          {getSensationLabel(value)}
        </p>
        <button
          type="button"
          onClick={onEditValue}
          aria-label="Cambiar intensidad y agrado"
          className="size-14 shrink-0 rounded-2xl bg-card p-1.5 shadow-sm ring-1 ring-border outline-none transition-transform active:scale-90 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <SensationPadDots value={value} density={7} />
        </button>
      </div>
      <SensationTagPicker
        options={getSensationTagOptions(quadrant)}
        selected={tags}
        styles={styles}
        onToggle={onToggleTag}
      />
      <Button size="lg" className="w-full" onClick={onContinue}>
        Listo
      </Button>
    </div>
  );
}
