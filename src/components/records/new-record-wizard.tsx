"use client";

import { AnimatePresence, motion } from "motion/react";

import { NewRecordContextStep } from "@/components/records/new-record-context-step";
import { NewRecordEmotionStep } from "@/components/records/new-record-emotion-step";
import { NewRecordIntensityStep } from "@/components/records/new-record-intensity-step";
import { NewRecordQuadrantStep } from "@/components/records/new-record-quadrant-step";
import { NewRecordReflectionStep } from "@/components/records/new-record-reflection-step";
import { NewRecordSuccess } from "@/components/records/new-record-success";
import { NewRecordTopBar } from "@/components/records/new-record-top-bar";
import { NewRecordWhenStep } from "@/components/records/new-record-when-step";
import {
  NEW_RECORD_PHASE_COUNT,
  useNewRecordWizard,
} from "@/components/records/use-new-record-wizard";
import type { CustomEmotion } from "@/db/schema";
import type { NewRecordStep } from "@/stores/new-record-store";
import { getContextTags } from "@/lib/context-tags";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type NewRecordWizardProps = {
  customEmotions: Pick<CustomEmotion, "name" | "quadrant">[];
};

const REFLECTION_STEPS = {
  situation: {
    eyebrow: "Profundizar · 1 de 3",
    title: "¿Qué ha pasado?",
    placeholder: "Describe la situación que te hizo sentir así...",
  },
  thoughts: {
    eyebrow: "Profundizar · 2 de 3",
    title: "¿Qué pasó por tu cabeza?",
    placeholder: "Los pensamientos que aparecieron en ese momento...",
  },
  behaviours: {
    eyebrow: "Profundizar · 3 de 3",
    title: "¿Qué hiciste?",
    placeholder: "Cómo reaccionaste o qué hiciste después...",
  },
} as const;

type ReflectionStep = keyof typeof REFLECTION_STEPS;

function isReflectionStep(step: NewRecordStep): step is ReflectionStep {
  return step in REFLECTION_STEPS;
}

const stepVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -48 }),
};

export function NewRecordWizard({ customEmotions }: NewRecordWizardProps) {
  const wizard = useNewRecordWizard(customEmotions);
  const { store, step, savedRecord } = wizard;
  const emotion = store.emotion ?? "";
  const activeQuadrant = savedRecord?.quadrant ?? store.quadrant;
  const showWash = Boolean(savedRecord) || step !== "quadrant";
  const reflectionStep = isReflectionStep(step) ? step : null;
  const contentKey = savedRecord ? "success" : step;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-[background-color,opacity] duration-700",
          getMoodStyles(activeQuadrant).soft,
          showWash ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />
      <NewRecordTopBar
        phase={savedRecord ? NEW_RECORD_PHASE_COUNT - 1 : wizard.phase}
        phaseCount={NEW_RECORD_PHASE_COUNT}
        canGoBack={!savedRecord && store.stepIndex > 0}
        onBack={wizard.back}
        onClose={wizard.close}
      />
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={store.direction} initial={false}>
          <motion.div
            key={contentKey}
            custom={store.direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {savedRecord ? (
              <NewRecordSuccess
                emotion={savedRecord.emotion}
                quadrant={savedRecord.quadrant}
                tags={savedRecord.tags}
                note={savedRecord.note}
                occurredAt={savedRecord.occurredAt}
                needsDeepen={savedRecord.needsDeepen}
                onOpenRecord={wizard.openSavedRecord}
                onGoHome={wizard.close}
              />
            ) : null}

            {!savedRecord && step === "quadrant" ? (
              <NewRecordQuadrantStep onSelect={store.selectQuadrant} />
            ) : null}

            {!savedRecord && step === "emotion" && store.quadrant ? (
              <NewRecordEmotionStep
                focusQuadrant={store.quadrant}
                selectedQuadrant={store.quadrant}
                emotion={store.emotion}
                definition={wizard.definition}
                options={wizard.options}
                creatingEmotion={wizard.creatingEmotion}
                onSelect={store.selectEmotion}
                onSearchSelect={wizard.handleSearchSelect}
                onQuickSave={wizard.handleQuickSave}
                onCreate={wizard.handleCreateEmotion}
                onContinue={store.nextStep}
              />
            ) : null}

            {!savedRecord && step === "intensity" ? (
              <NewRecordIntensityStep
                emotion={emotion}
                quadrant={store.quadrant}
                intensity={store.intensity}
                onChange={(value) => store.setField("intensity", value)}
                onContinue={store.nextStep}
              />
            ) : null}

            {!savedRecord && step === "context" ? (
              <NewRecordContextStep
                emotion={emotion}
                quadrant={store.quadrant}
                context={store.context}
                onToggle={store.toggleContextTag}
                onContinue={store.nextStep}
              />
            ) : null}

            {!savedRecord && reflectionStep ? (
              <NewRecordReflectionStep
                id={reflectionStep}
                eyebrow={REFLECTION_STEPS[reflectionStep].eyebrow}
                title={REFLECTION_STEPS[reflectionStep].title}
                placeholder={REFLECTION_STEPS[reflectionStep].placeholder}
                quadrant={store.quadrant}
                value={store[reflectionStep]}
                onChange={(value) => store.setField(reflectionStep, value)}
                onContinue={store.nextStep}
              />
            ) : null}

            {!savedRecord && step === "when" ? (
              <NewRecordWhenStep
                emotion={emotion}
                quadrant={store.quadrant}
                tags={getContextTags(store.context)}
                note={store.situation}
                occurredAt={store.occurredAt}
                pending={wizard.pending}
                onChange={(date) => store.setField("occurredAt", date)}
                onSave={wizard.handleSave}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
