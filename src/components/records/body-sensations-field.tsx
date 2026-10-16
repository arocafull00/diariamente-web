"use client";

import { BodySensationsCard } from "@/components/records/body-sensations-card";
import { BodySensationsSheet } from "@/components/records/body-sensations-sheet";
import { useBodySensationsSheet } from "@/components/records/use-body-sensations-sheet";
import type { BodySensation } from "@/db/schema";

type BodySensationsFieldProps = {
  sensations: BodySensation[];
  onSave: (sensation: BodySensation) => void;
  onRemove: (region: string) => void;
};

export function BodySensationsField({
  sensations,
  onSave,
  onRemove,
}: BodySensationsFieldProps) {
  const sheet = useBodySensationsSheet({ sensations, onSave, onRemove });

  return (
    <>
      <BodySensationsCard
        sensations={sensations}
        onOpen={sheet.openSheet}
      />
      <BodySensationsSheet sheet={sheet} sensations={sensations} />
    </>
  );
}
