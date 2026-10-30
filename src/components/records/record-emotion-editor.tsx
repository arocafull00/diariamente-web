"use client";

import { AnimatePresence, motion } from "motion/react";

import { NewRecordEmotionStep } from "@/components/records/new-record-emotion-step";
import { NewRecordIntensityStep } from "@/components/records/new-record-intensity-step";
import { NewRecordQuadrantStep } from "@/components/records/new-record-quadrant-step";
import { NewRecordTopBar } from "@/components/records/new-record-top-bar";
import { RecordEditorOverlay } from "@/components/records/record-editor-overlay";
import {
  RECORD_EMOTION_EDITOR_STEPS,
  useRecordEmotionEditor,
} from "@/components/records/use-record-emotion-editor";
import type { GrammaticalGender, MoodQuadrant, RecordEmotion } from "@/db/schema";
import { EMOTIONS, getEmotionLabel } from "@/lib/emotions";
import { cn } from "@/lib/utils";

const stepVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -48 }),
};

type RecordEmotionEditorProps = {
  emotion: RecordEmotion | null;
  quadrant: MoodQuadrant | null;
  gender: GrammaticalGender;
  onApply: (emotion: RecordEmotion & { quadrant: MoodQuadrant }) => void;
  onClose: () => void;
};

export function RecordEmotionEditor({
  emotion,
  quadrant,
  gender,
  onApply,
  onClose,
}: RecordEmotionEditorProps) {
  const editor = useRecordEmotionEditor({ emotion, quadrant, gender, onApply, onClose });
  const { draft, step } = editor;

  return (
    <RecordEditorOverlay palette={step === "quadrant" ? null : editor.palette}>
      <NewRecordTopBar
        phase={editor.phase}
        phaseCount={RECORD_EMOTION_EDITOR_STEPS.length}
        canGoBack={step !== "quadrant"}
        onBack={editor.back}
        onClose={onClose}
      />
      <div className={cn("relative flex-1 overflow-hidden", step === "emotion" && "-mt-16")}>
        <AnimatePresence mode="wait" custom={editor.direction} initial={false}>
          <motion.div
            key={step}
            custom={editor.direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {step === "quadrant" ? (
              <NewRecordQuadrantStep
                onSelect={(group) => editor.selectGroup(group.id, group.quadrant)}
              />
            ) : null}

            {step === "emotion" && draft.quadrant ? (
              <NewRecordEmotionStep
                selectedQuadrant={draft.quadrant}
                selectedGroup={draft.group}
                emotion={draft.emotion}
                definition={editor.definition}
                options={EMOTIONS}
                gender={gender}
                onSelect={editor.selectEmotion}
                onQuickSave={editor.quickSelect}
                onContinue={editor.continueToIntensity}
              />
            ) : null}

            {step === "intensity" ? (
              <NewRecordIntensityStep
                emotion={getEmotionLabel(draft.emotion ?? "", gender)}
                quadrant={editor.palette}
                intensity={draft.intensity}
                onChange={editor.setIntensity}
                onContinue={editor.apply}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </RecordEditorOverlay>
  );
}
