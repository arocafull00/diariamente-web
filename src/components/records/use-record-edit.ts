"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import type {
  BodySensation,
  MoodQuadrant,
  PatientRecord,
  RecordEmotion,
  StoredBodySensation,
} from "@/db/schema";
import {
  getEditableSensations,
  getLegacySensations,
} from "@/lib/body-sensations";
import { getDominantEmotion } from "@/lib/emotions";
import { updatePatientRecord } from "@/server/actions/records";

function normalizeSensations(sensations: StoredBodySensation[]) {
  return [...getEditableSensations(sensations), ...getLegacySensations(sensations)];
}

function isSame(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useRecordEdit(record: PatientRecord) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [situation, setSituation] = useState(record.situation);
  const [thoughts, setThoughts] = useState(record.thoughts);
  const [behaviours, setBehaviours] = useState(record.behaviours);
  const [quadrant, setQuadrant] = useState(record.quadrant);
  const [emotions, setEmotions] = useState(record.emotions);
  const [bodySensations, setBodySensations] = useState(() =>
    normalizeSensations(record.bodySensations),
  );
  const hasChanges =
    situation !== record.situation ||
    thoughts !== record.thoughts ||
    behaviours !== record.behaviours ||
    quadrant !== record.quadrant ||
    !isSame(emotions, record.emotions) ||
    !isSame(bodySensations, normalizeSensations(record.bodySensations));

  function updateEmotion({
    emotion,
    intensity,
    quadrant: next,
  }: RecordEmotion & { quadrant: MoodQuadrant }) {
    const dominant = getDominantEmotion(emotions);
    const edited = { emotion, intensity };

    setQuadrant(next);
    setEmotions(
      dominant
        ? emotions.map((item) => (item === dominant ? edited : item))
        : [edited],
    );
  }

  function updateBodySensations(next: BodySensation[]) {
    setBodySensations([...next, ...getLegacySensations(bodySensations)]);
  }

  function save() {
    startTransition(async () => {
      const result = await updatePatientRecord(record.id, {
        quadrant,
        emotions,
        bodySensations: getEditableSensations(bodySensations),
        situation,
        thoughts,
        behaviours,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Registro actualizado");
      router.refresh();
    });
  }

  return {
    pending,
    hasChanges,
    situation,
    thoughts,
    behaviours,
    quadrant,
    emotions,
    bodySensations,
    setSituation,
    setThoughts,
    setBehaviours,
    updateEmotion,
    updateBodySensations,
    save,
  };
}
