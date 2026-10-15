"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import type { CustomEmotion, MoodQuadrant, RecordContext } from "@/db/schema";
import { EMPTY_RECORD_CONTEXT, getContextTags } from "@/lib/context-tags";
import {
  CUSTOM_EMOTION_DEFINITION,
  EMOTIONS,
  type EmotionOption,
} from "@/lib/emotions";
import { createCustomEmotion, createPatientRecord } from "@/server/actions/records";
import {
  NEW_RECORD_STEPS,
  useNewRecordStore,
  type NewRecordStep,
} from "@/stores/new-record-store";

const PHASE_BY_STEP: Record<NewRecordStep, number> = {
  quadrant: 0,
  emotion: 0,
  intensity: 0,
  context: 1,
  situation: 2,
  thoughts: 2,
  behaviours: 2,
  when: 3,
};

export const NEW_RECORD_PHASE_COUNT = 4;

type RecordDraft = {
  emotion: string;
  quadrant: MoodQuadrant;
  intensity: number;
  context: RecordContext;
  situation: string;
  thoughts: string;
  behaviours: string;
  occurredAt: Date;
};

type SavedRecord = {
  id: string;
  emotion: string;
  quadrant: MoodQuadrant;
  tags: string[];
  note: string;
  occurredAt: Date;
  needsDeepen: boolean;
};

export function useNewRecordWizard(
  customEmotions: Pick<CustomEmotion, "name" | "quadrant">[],
) {
  const router = useRouter();
  const store = useNewRecordStore();
  const [pending, startTransition] = useTransition();
  const [creatingEmotion, startCreateEmotion] = useTransition();
  const [extraEmotions, setExtraEmotions] = useState<EmotionOption[]>([]);
  const [savedRecord, setSavedRecord] = useState<SavedRecord | null>(null);

  useEffect(() => {
    if (useNewRecordStore.getState().quadrant === null) {
      useNewRecordStore.getState().reset();
    }
  }, []);

  const step = NEW_RECORD_STEPS[store.stepIndex];
  const phase = PHASE_BY_STEP[step];
  const options = dedupeOptions([
    ...EMOTIONS,
    ...customEmotions.map((emotion) => ({
      name: emotion.name,
      definition: CUSTOM_EMOTION_DEFINITION,
      quadrant: emotion.quadrant,
    })),
    ...extraEmotions,
  ]);
  const definition =
    options.find((option) => option.name === store.emotion)?.definition ??
    CUSTOM_EMOTION_DEFINITION;

  function save(draft: RecordDraft) {
    startTransition(async () => {
      const result = await createPatientRecord({
        occurredAt: draft.occurredAt,
        quadrant: draft.quadrant,
        emotions: [{ emotion: draft.emotion, intensity: draft.intensity }],
        context: draft.context,
        situation: draft.situation,
        thoughts: draft.thoughts,
        behaviours: draft.behaviours,
      });

      if (result.error || !result.recordId) {
        toast.error(result.error ?? "No se pudo guardar el registro");
        return;
      }

      setSavedRecord({
        id: result.recordId,
        emotion: draft.emotion,
        quadrant: draft.quadrant,
        tags: getContextTags(draft.context),
        note: draft.situation,
        occurredAt: draft.occurredAt,
        needsDeepen: !draft.situation || !draft.thoughts || !draft.behaviours,
      });
      useNewRecordStore.getState().reset();
    });
  }

  function handleSave() {
    if (!store.emotion || !store.quadrant) {
      return;
    }

    save({
      emotion: store.emotion,
      quadrant: store.quadrant,
      intensity: store.intensity,
      context: store.context,
      situation: store.situation,
      thoughts: store.thoughts,
      behaviours: store.behaviours,
      occurredAt: store.occurredAt,
    });
  }

  function handleQuickSave(emotion: string, quadrant: MoodQuadrant) {
    if (pending) {
      return;
    }

    store.selectEmotion(emotion, quadrant);
    save({
      emotion,
      quadrant,
      intensity: 5,
      context: EMPTY_RECORD_CONTEXT,
      situation: "",
      thoughts: "",
      behaviours: "",
      occurredAt: new Date(),
    });
  }

  function handleSearchSelect(option: EmotionOption) {
    const quadrant = option.quadrant ?? store.quadrant;

    if (!quadrant) {
      return;
    }

    store.selectEmotion(option.name, quadrant);
  }

  function handleCreateEmotion(name: string) {
    const quadrant = store.quadrant;

    if (!quadrant || !name) {
      return;
    }

    setExtraEmotions((current) => [
      ...current,
      { name, definition: CUSTOM_EMOTION_DEFINITION, quadrant },
    ]);
    store.selectEmotion(name, quadrant);

    startCreateEmotion(async () => {
      const result = await createCustomEmotion(name, quadrant);

      if (!result.error) {
        return;
      }

      setExtraEmotions((current) => current.filter((item) => item.name !== name));

      if (useNewRecordStore.getState().emotion === name) {
        useNewRecordStore.getState().setField("emotion", null);
      }

      toast.error(result.error);
    });
  }

  function close() {
    store.reset();
    router.push("/inicio");
  }

  function back() {
    if (store.stepIndex === 0) {
      close();
      return;
    }

    store.previousStep();
  }

  return {
    store,
    step,
    phase,
    options,
    definition,
    pending,
    creatingEmotion,
    savedRecord,
    handleSave,
    handleQuickSave,
    handleSearchSelect,
    handleCreateEmotion,
    back,
    close,
    openSavedRecord: () => {
      if (savedRecord) {
        router.push(`/registro/${savedRecord.id}`);
      }
    },
  };
}

function dedupeOptions(options: EmotionOption[]) {
  const seen = new Set<string>();

  return options.filter((option) => {
    const key = option.name.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
