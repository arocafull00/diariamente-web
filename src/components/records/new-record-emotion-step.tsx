"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

import { EmotionFieldQuadrant } from "@/components/records/emotion-field-quadrant";
import { EmotionSearchSheet } from "@/components/records/emotion-search-sheet";
import { EmotionSelectionBar } from "@/components/records/emotion-selection-bar";
import { usePannableField } from "@/components/records/use-pannable-field";
import { useSelectionPush } from "@/components/records/use-selection-push";
import type { MoodQuadrant } from "@/db/schema";
import {
  getMoodStyles,
  isMoodQuadrant,
  MOOD_QUADRANTS,
  type EmotionOption,
} from "@/lib/emotions";

type NewRecordEmotionStepProps = {
  focusQuadrant: MoodQuadrant;
  selectedQuadrant: MoodQuadrant | null;
  emotion: string | null;
  definition: string;
  options: EmotionOption[];
  onSelect: (name: string, quadrant: MoodQuadrant) => void;
  onSearchSelect: (option: EmotionOption) => void;
  onQuickSave: (name: string, quadrant: MoodQuadrant) => void;
  onContinue: () => void;
};

export function NewRecordEmotionStep({
  focusQuadrant,
  selectedQuadrant,
  emotion,
  definition,
  options,
  onSelect,
  onSearchSelect,
  onQuickSave,
  onContinue,
}: NewRecordEmotionStepProps) {
  const quadrantRefs = useRef<Partial<Record<MoodQuadrant, HTMLDivElement | null>>>({});
  const {
    containerRef,
    contentRef,
    bounds,
    fieldMotion,
    centerOn,
    handleWheel,
    dragHandlers,
  } = usePannableField({
    getFocusTarget: () => quadrantRefs.current[focusQuadrant] ?? null,
    onFocusChange: (element) => {
      const { emotion: name, quadrant } = element.dataset;

      if (name && isMoodQuadrant(quadrant)) {
        onSelect(name, quadrant);
      }
    },
  });
  const selectionPush = useSelectionPush(contentRef, emotion);

  function handleTap(name: string, quadrant: MoodQuadrant) {
    onSelect(name, quadrant);
    const element = contentRef.current?.querySelector<HTMLElement>(
      `[data-emotion="${CSS.escape(name)}"]`,
    );

    if (element) {
      centerOn(element);
    }
  }

  const callbacks = useRef({ handleTap, onQuickSave });

  useLayoutEffect(() => {
    callbacks.current = { handleTap, onQuickSave };
  });

  const [bubbleHandlers] = useState(() => ({
    onSelect: (name: string, quadrant: MoodQuadrant) =>
      callbacks.current.handleTap(name, quadrant),
    onQuickSave: (name: string, quadrant: MoodQuadrant) =>
      callbacks.current.onQuickSave(name, quadrant),
  }));

  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="absolute inset-0 cursor-grab touch-none overflow-hidden mask-y-from-92% active:cursor-grabbing"
      >
        <motion.div
          ref={contentRef}
          drag
          dragConstraints={bounds}
          dragElastic={0.12}
          dragTransition={{ power: 0.25, timeConstant: 260 }}
          style={{ x: fieldMotion.panX, y: fieldMotion.panY }}
          {...dragHandlers}
          className="absolute top-0 left-0 grid w-max grid-cols-2 gap-0.5"
        >
          {MOOD_QUADRANTS.map((quadrant) => (
            <EmotionFieldQuadrant
              key={quadrant.id}
              ref={(node) => {
                quadrantRefs.current[quadrant.id] = node;
              }}
              quadrant={quadrant.id}
              names={options
                .filter((option) => option.quadrant === quadrant.id)
                .map((option) => option.name)}
              selectedEmotion={selectedQuadrant === quadrant.id ? emotion : null}
              field={fieldMotion}
              selection={selectionPush}
              onSelect={bubbleHandlers.onSelect}
              onQuickSave={bubbleHandlers.onQuickSave}
            />
          ))}
        </motion.div>
      </div>

      <div className="absolute top-19 right-4 z-20">
        <EmotionSearchSheet options={options} onSelect={onSearchSelect} />
      </div>

      <EmotionSelectionBar
        emotion={emotion}
        definition={definition}
        styles={getMoodStyles(selectedQuadrant)}
        onContinue={onContinue}
      />
    </div>
  );
}
