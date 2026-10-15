"use client";

import { QuadrantBlob } from "@/components/records/quadrant-blob";
import type { MoodQuadrant } from "@/db/schema";
import { MOOD_QUADRANTS } from "@/lib/emotions";

type NewRecordQuadrantStepProps = {
  onSelect: (quadrant: MoodQuadrant) => void;
};

export function NewRecordQuadrantStep({ onSelect }: NewRecordQuadrantStepProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center gap-10 px-6 pb-10">
      <div className="space-y-3 text-center">
        <h2 className="font-display text-3xl leading-tight font-medium text-balance sm:text-4xl">
          ¿Cómo te sientes ahora mismo?
        </h2>
        <p className="text-sm text-muted-foreground">
          Toca el color que mejor describa cómo te sientes
        </p>
      </div>
      <div className="grid w-full grid-cols-2 gap-1">
        {MOOD_QUADRANTS.map((quadrant, index) => (
          <QuadrantBlob
            key={quadrant.id}
            quadrant={quadrant.id}
            energy={quadrant.energy}
            pleasantness={quadrant.pleasantness}
            index={index}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
