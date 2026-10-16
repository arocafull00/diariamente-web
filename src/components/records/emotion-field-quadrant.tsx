"use client";

import { EmotionBubble } from "@/components/records/emotion-bubble";
import type { FieldMotion } from "@/components/records/use-pannable-field";
import type { SelectionPush } from "@/components/records/use-selection-push";
import type { MoodQuadrant } from "@/db/schema";
import { getEmotionTone, MOOD_STYLES } from "@/lib/emotions";
import { cn } from "@/lib/utils";

const COLUMNS = 5;

type EmotionFieldQuadrantProps = {
  ref: React.Ref<HTMLDivElement>;
  quadrant: MoodQuadrant;
  names: string[];
  selectedEmotion: string | null;
  field: FieldMotion;
  selection: SelectionPush;
  onSelect: (name: string, quadrant: MoodQuadrant) => void;
  onQuickSave: (name: string, quadrant: MoodQuadrant) => void;
};

function chunk(names: string[]) {
  const rows: { name: string; index: number }[][] = [];

  names.forEach((name, index) => {
    const rowIndex = Math.floor(index / COLUMNS);
    rows[rowIndex] = [...(rows[rowIndex] ?? []), { name, index }];
  });

  return rows;
}

export function EmotionFieldQuadrant({
  ref,
  quadrant,
  names,
  selectedEmotion,
  field,
  selection,
  onSelect,
  onQuickSave,
}: EmotionFieldQuadrantProps) {
  const styles = MOOD_STYLES[quadrant];
  const isLowEnergy = quadrant.startsWith("LOW");
  const isPleasant = quadrant === "HIGH_PLEASANT" || quadrant === "LOW_PLEASANT";
  const rows = chunk(names);
  const orderedRows = isLowEnergy ? [...rows].reverse() : rows;

  return (
    <div ref={ref} className="flex flex-col gap-0.5">
      {orderedRows.map((row, rowIndex) => {
        const cells = isPleasant ? [...row].reverse() : row;

        return (
          <div
            key={row[0]?.name ?? rowIndex}
            className={cn("flex gap-0.5", isPleasant && "justify-end")}
          >
            {cells.map((cell) => (
              <EmotionBubble
                key={cell.name}
                name={cell.name}
                quadrant={quadrant}
                field={field}
                selection={selection}
                tone={getEmotionTone(cell.index, names.length)}
                styles={styles}
                selected={selectedEmotion === cell.name}
                delay={Math.min(cell.index * 0.015, 0.35)}
                onSelect={onSelect}
                onQuickSave={onQuickSave}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
