"use client";

import { EmotionBubble } from "@/components/records/emotion-bubble";
import type { FieldMotion } from "@/components/records/use-pannable-field";
import type { SelectionPush } from "@/components/records/use-selection-push";
import type { GrammaticalGender, MoodQuadrant } from "@/db/schema";
import {
  getEmotionLabel,
  getEmotionTone,
  MOOD_STYLES,
  type EmotionGroup,
  type EmotionGroupItem,
} from "@/lib/emotions";
import { cn } from "@/lib/utils";

const COLUMNS = 5;

type EmotionFieldGroupProps = {
  ref: React.Ref<HTMLDivElement>;
  group: EmotionGroup;
  position: number;
  gender: GrammaticalGender;
  selectedEmotion: string | null;
  field: FieldMotion;
  selection: SelectionPush;
  onSelect: (name: string, quadrant: MoodQuadrant, group: string) => void;
  onQuickSave: (name: string, quadrant: MoodQuadrant, group: string) => void;
};

function chunk(items: EmotionGroupItem[]) {
  const rows: (EmotionGroupItem & { index: number })[][] = [];

  items.forEach((item, index) => {
    const rowIndex = Math.floor(index / COLUMNS);
    rows[rowIndex] = [...(rows[rowIndex] ?? []), { ...item, index }];
  });

  return rows;
}

export function EmotionFieldGroup({
  ref,
  group,
  position,
  gender,
  selectedEmotion,
  field,
  selection,
  onSelect,
  onQuickSave,
}: EmotionFieldGroupProps) {
  const isBottom = position >= 2;
  const isRight = position % 2 === 1;
  const rows = chunk(group.items);
  const orderedRows = isBottom ? [...rows].reverse() : rows;

  return (
    <div ref={ref} className="flex flex-col gap-0.5">
      {orderedRows.map((row, rowIndex) => {
        const cells = isRight ? [...row].reverse() : row;

        return (
          <div
            key={row[0]?.name ?? rowIndex}
            className={cn("flex gap-0.5", isRight && "justify-end")}
          >
            {cells.map((cell) => (
              <EmotionBubble
                key={cell.name}
                name={cell.name}
                label={getEmotionLabel(cell.name, gender)}
                quadrant={cell.quadrant}
                group={group.id}
                field={field}
                selection={selection}
                tone={getEmotionTone(cell.index, group.items.length)}
                styles={MOOD_STYLES[cell.quadrant]}
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
