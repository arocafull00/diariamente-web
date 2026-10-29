"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

import { EmotionFieldGroup } from "@/components/records/emotion-field-group";
import { usePannableField } from "@/components/records/use-pannable-field";
import { useSelectionPush } from "@/components/records/use-selection-push";
import type { GrammaticalGender, MoodQuadrant } from "@/db/schema";
import { isMoodQuadrant, type EmotionGroup } from "@/lib/emotions";

type EmotionFieldPickerProps = {
  groups: EmotionGroup[];
  selectedGroup: string | null;
  emotion: string | null;
  gender: GrammaticalGender;
  onSelect: (name: string, quadrant: MoodQuadrant, group: string) => void;
  onQuickSave: (name: string, quadrant: MoodQuadrant, group: string) => void;
  onContinue: () => void;
};

function getBubbleSelector(group: string, name: string) {
  return `[data-group="${CSS.escape(group)}"][data-emotion="${CSS.escape(name)}"]`;
}

export function EmotionFieldPicker({
  groups,
  selectedGroup,
  emotion,
  gender,
  onSelect,
  onQuickSave,
  onContinue,
}: EmotionFieldPickerProps) {
  const groupRefs = useRef<Partial<Record<string, HTMLDivElement | null>>>({});
  const selectedSelector =
    selectedGroup && emotion ? getBubbleSelector(selectedGroup, emotion) : null;
  const {
    containerRef,
    contentRef,
    bounds,
    fieldMotion,
    centerOn,
    handleWheel,
    dragHandlers,
  } = usePannableField({
    getFocusTarget: () => {
      const selected = selectedSelector
        ? contentRef.current?.querySelector<HTMLElement>(selectedSelector)
        : null;

      if (selected) {
        return selected;
      }

      return selectedGroup ? groupRefs.current[selectedGroup] ?? null : null;
    },
    onFocusChange: (element) => {
      const { emotion: name, quadrant, group } = element.dataset;

      if (name && group && isMoodQuadrant(quadrant)) {
        onSelect(name, quadrant, group);
      }
    },
  });
  const selectionPush = useSelectionPush(contentRef, selectedSelector);

  function handleTap(name: string, quadrant: MoodQuadrant, group: string) {
    if (emotion === name && selectedGroup === group) {
      onContinue();
      return;
    }

    onSelect(name, quadrant, group);
    const element = contentRef.current?.querySelector<HTMLElement>(
      getBubbleSelector(group, name),
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
    onSelect: (name: string, quadrant: MoodQuadrant, group: string) =>
      callbacks.current.handleTap(name, quadrant, group),
    onQuickSave: (name: string, quadrant: MoodQuadrant, group: string) =>
      callbacks.current.onQuickSave(name, quadrant, group),
  }));

  return (
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
        {groups.map((group, index) => (
          <EmotionFieldGroup
            key={group.id}
            ref={(node) => {
              groupRefs.current[group.id] = node;
            }}
            group={group}
            position={index}
            gender={gender}
            selectedEmotion={selectedGroup === group.id ? emotion : null}
            field={fieldMotion}
            selection={selectionPush}
            onSelect={bubbleHandlers.onSelect}
            onQuickSave={bubbleHandlers.onQuickSave}
          />
        ))}
      </motion.div>
    </div>
  );
}
