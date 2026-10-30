"use client";

import { useState } from "react";

import type { GrammaticalGender, MoodQuadrant, RecordEmotion } from "@/db/schema";
import { findEmotionTreeRoot, getEmotionGroupPalette } from "@/lib/emotion-tree";
import { findEmotion, getEmotionDefinition } from "@/lib/emotions";
import { useEmotionPickerModeStore } from "@/stores/emotion-picker-mode-store";

export const RECORD_EMOTION_EDITOR_STEPS = ["quadrant", "emotion", "intensity"] as const;

type RecordEmotionEditorStep = (typeof RECORD_EMOTION_EDITOR_STEPS)[number];

type UseRecordEmotionEditorOptions = {
  emotion: RecordEmotion | null;
  quadrant: MoodQuadrant | null;
  gender: GrammaticalGender;
  onApply: (emotion: RecordEmotion & { quadrant: MoodQuadrant }) => void;
  onClose: () => void;
};

type EmotionDraft = {
  quadrant: MoodQuadrant | null;
  group: string | null;
  emotion: string | null;
  intensity: number;
};

function getInitialGroup(emotion: string | null, quadrant: MoodQuadrant | null) {
  if (useEmotionPickerModeStore.getState().mode === "field") {
    return quadrant;
  }

  return emotion ? (findEmotionTreeRoot(emotion) ?? null) : null;
}

export function useRecordEmotionEditor({
  emotion,
  quadrant,
  gender,
  onApply,
  onClose,
}: UseRecordEmotionEditorOptions) {
  const [draft, setDraft] = useState<EmotionDraft>(() => ({
    quadrant,
    group: getInitialGroup(emotion?.emotion ?? null, quadrant),
    emotion: emotion?.emotion ?? null,
    intensity: emotion?.intensity ?? 5,
  }));
  const [step, setStep] = useState<RecordEmotionEditorStep>(
    emotion && quadrant ? "intensity" : "quadrant",
  );
  const [direction, setDirection] = useState<1 | -1>(1);
  const selectedOption = draft.emotion ? findEmotion(draft.emotion) : undefined;
  const definition = selectedOption ? getEmotionDefinition(selectedOption, gender) : "";
  const palette = draft.quadrant
    ? getEmotionGroupPalette(draft.group, draft.quadrant)
    : null;

  function goTo(next: RecordEmotionEditorStep, nextDirection: 1 | -1) {
    setDirection(nextDirection);
    setStep(next);
  }

  function selectGroup(group: string, groupQuadrant: MoodQuadrant) {
    if (draft.group !== group) {
      setDraft({ ...draft, quadrant: groupQuadrant, group, emotion: null });
    }

    goTo("emotion", 1);
  }

  function selectEmotion(name: string, emotionQuadrant: MoodQuadrant, group: string) {
    setDraft({ ...draft, emotion: name, quadrant: emotionQuadrant, group });
  }

  function quickSelect(name: string, emotionQuadrant: MoodQuadrant, group: string) {
    selectEmotion(name, emotionQuadrant, group);
    goTo("intensity", 1);
  }

  function back() {
    if (step === "quadrant") {
      onClose();
      return;
    }

    goTo(step === "intensity" && draft.quadrant ? "emotion" : "quadrant", -1);
  }

  function apply() {
    if (!draft.emotion || !draft.quadrant) {
      return;
    }

    onApply({
      emotion: draft.emotion,
      intensity: draft.intensity,
      quadrant: draft.quadrant,
    });
  }

  return {
    draft,
    step,
    phase: RECORD_EMOTION_EDITOR_STEPS.indexOf(step),
    direction,
    definition,
    palette,
    selectGroup,
    selectEmotion,
    quickSelect,
    setIntensity: (intensity: number) => setDraft({ ...draft, intensity }),
    continueToIntensity: () => {
      if (draft.emotion) {
        goTo("intensity", 1);
      }
    },
    back,
    apply,
  };
}
