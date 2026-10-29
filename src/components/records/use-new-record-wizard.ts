"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import type {
  BodySensation,
  GrammaticalGender,
  MoodQuadrant,
  RecordContext,
} from "@/db/schema";
import { EMPTY_RECORD_CONTEXT, getContextTags } from "@/lib/context-tags";
import { getEmotionGroupPalette } from "@/lib/emotion-tree";
import {
  EMOTIONS,
  findEmotion,
  getEmotionDefinition,
  type EmotionOption,
} from "@/lib/emotions";
import { logger } from "@/lib/logger";
import { createPatientRecord } from "@/server/actions/records";
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
  body: 1,
  situation: 2,
  thoughts: 2,
  behaviours: 2,
  when: 3,
};

export const NEW_RECORD_PHASE_COUNT = 4;

type RecordDraft = {
  emotion: string;
  quadrant: MoodQuadrant;
  group: string | null;
  intensity: number;
  context: RecordContext;
  bodySensations: BodySensation[];
  situation: string;
  thoughts: string;
  behaviours: string;
  occurredAt: Date;
};

type SavedRecord = {
  id: string;
  emotion: string;
  quadrant: MoodQuadrant;
  palette: MoodQuadrant;
  tags: string[];
  note: string;
  occurredAt: Date;
  needsDeepen: boolean;
};

export function useNewRecordWizard(gender: GrammaticalGender) {
  const router = useRouter();
  const store = useNewRecordStore();
  const [pending, startTransition] = useTransition();
  const [savedRecord, setSavedRecord] = useState<SavedRecord | null>(null);

  useEffect(() => {
    if (useNewRecordStore.getState().quadrant === null) {
      useNewRecordStore.getState().reset();
    }
  }, []);

  const step = NEW_RECORD_STEPS[store.stepIndex];
  const phase = PHASE_BY_STEP[step];
  const options: EmotionOption[] = EMOTIONS;
  const selectedOption = store.emotion ? findEmotion(store.emotion) : undefined;
  const definition = selectedOption
    ? getEmotionDefinition(selectedOption, gender)
    : "";

  function save(draft: RecordDraft) {
    startTransition(async () => {
      const result = await createPatientRecord({
        occurredAt: draft.occurredAt,
        quadrant: draft.quadrant,
        emotions: [{ emotion: draft.emotion, intensity: draft.intensity }],
        context: draft.context,
        bodySensations: draft.bodySensations,
        situation: draft.situation,
        thoughts: draft.thoughts,
        behaviours: draft.behaviours,
      }).catch((error: unknown) => {
        logger.error("records.create_request_failed", error);
        return { error: "No se pudo guardar el registro", recordId: undefined };
      });

      if (result.error || !result.recordId) {
        toast.error(result.error ?? "No se pudo guardar el registro");
        return;
      }

      setSavedRecord({
        id: result.recordId,
        emotion: draft.emotion,
        quadrant: draft.quadrant,
        palette: getEmotionGroupPalette(draft.group, draft.quadrant),
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
      group: store.group,
      intensity: store.intensity,
      context: store.context,
      bodySensations: store.bodySensations,
      situation: store.situation,
      thoughts: store.thoughts,
      behaviours: store.behaviours,
      occurredAt: store.occurredAt,
    });
  }

  function handleQuickSave(emotion: string, quadrant: MoodQuadrant, group: string) {
    if (pending) {
      return;
    }

    store.selectEmotion(emotion, quadrant, group);
    save({
      emotion,
      quadrant,
      group,
      intensity: 5,
      context: EMPTY_RECORD_CONTEXT,
      bodySensations: [],
      situation: "",
      thoughts: "",
      behaviours: "",
      occurredAt: new Date(),
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
    savedRecord,
    handleSave,
    handleQuickSave,
    back,
    close,
    openSavedRecord: () => {
      if (savedRecord) {
        router.push(`/registro/${savedRecord.id}`);
      }
    },
  };
}
