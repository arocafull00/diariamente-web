"use client";

import { AnimatePresence, motion } from "motion/react";

import { EmotionPickerModeToggle } from "@/components/records/emotion-picker-mode-toggle";
import { QuadrantBlob } from "@/components/records/quadrant-blob";
import { EMOTION_TREE_GROUPS } from "@/lib/emotion-tree";
import { EMOTION_QUADRANT_GROUPS, type EmotionGroup } from "@/lib/emotions";
import { useEmotionPickerModeStore } from "@/stores/emotion-picker-mode-store";

const SUBTITLES = {
  field: "Toca el color que mejor describa cómo te sientes",
  tree: "Toca la emoción que más se acerque a lo que sientes",
} as const;

type NewRecordQuadrantStepProps = {
  onSelect: (group: EmotionGroup) => void;
};

export function NewRecordQuadrantStep({ onSelect }: NewRecordQuadrantStepProps) {
  const mode = useEmotionPickerModeStore((state) => state.mode);
  const toggleMode = useEmotionPickerModeStore((state) => state.toggleMode);
  const groups = mode === "tree" ? EMOTION_TREE_GROUPS : EMOTION_QUADRANT_GROUPS;

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center gap-10 px-6 pb-10">
      <div className="space-y-3 text-center">
        <h2 className="font-display text-3xl leading-tight font-medium text-balance sm:text-4xl">
          ¿Cómo te sientes ahora mismo?
        </h2>
        <p className="text-sm text-muted-foreground">{SUBTITLES[mode]}</p>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.18, ease: "easeIn" }}
          className="grid w-full grid-cols-2 gap-1"
        >
          {groups.map((group, index) => (
            <QuadrantBlob
              key={group.id}
              quadrant={group.quadrant}
              label={group.label}
              index={index}
              onSelect={() => onSelect(group)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      <EmotionPickerModeToggle mode={mode} onToggle={toggleMode} />
    </div>
  );
}
