"use client";

import { BodySensationsCard } from "@/components/records/body-sensations-card";
import { BodySensationsSheet } from "@/components/records/body-sensations-sheet";
import { useBodySensationsSheet } from "@/components/records/use-body-sensations-sheet";
import type { BodyFigure, BodySensation } from "@/db/schema";

type BodySensationsFieldProps = {
  initialFigure: BodyFigure | null;
  sensations: BodySensation[];
  onSave: (sensation: BodySensation) => void;
  onRemove: (region: string) => void;
};

export function BodySensationsField({
  initialFigure,
  sensations,
  onSave,
  onRemove,
}: BodySensationsFieldProps) {
  const sheet = useBodySensationsSheet({ initialFigure, sensations, onSave, onRemove });

  return (
    <>
      <BodySensationsCard
        figure={sheet.figure}
        sensations={sensations}
        onOpen={sheet.openSheet}
      />
      <BodySensationsSheet sheet={sheet} sensations={sensations} />
    </>
  );
}
