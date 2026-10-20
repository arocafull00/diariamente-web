import type { BodySensation, MoodQuadrant, RecordContext } from "@/db/schema";
import { EMPTY_RECORD_CONTEXT, type ContextGroup } from "@/lib/context-tags";
import { create } from "zustand";

export const NEW_RECORD_STEPS = [
  "quadrant",
  "emotion",
  "intensity",
  "context",
  "body",
  "situation",
  "thoughts",
  "behaviours",
  "when",
] as const;

export type NewRecordStep = (typeof NEW_RECORD_STEPS)[number];

type NewRecordData = {
  stepIndex: number;
  direction: 1 | -1;
  quadrant: MoodQuadrant | null;
  emotion: string | null;
  intensity: number;
  context: RecordContext;
  bodySensations: BodySensation[];
  situation: string;
  thoughts: string;
  behaviours: string;
  occurredAt: Date;
};

type NewRecordState = NewRecordData & {
  setField: <K extends keyof NewRecordData>(key: K, value: NewRecordData[K]) => void;
  selectQuadrant: (quadrant: MoodQuadrant) => void;
  selectEmotion: (emotion: string, quadrant: MoodQuadrant) => void;
  toggleContextTag: (group: ContextGroup, tag: string) => void;
  saveBodySensation: (sensation: BodySensation) => void;
  removeBodySensation: (id: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
};

function getInitialState(): NewRecordData {
  return {
    stepIndex: 0,
    direction: 1,
    quadrant: null,
    emotion: null,
    intensity: 5,
    context: EMPTY_RECORD_CONTEXT,
    bodySensations: [],
    situation: "",
    thoughts: "",
    behaviours: "",
    occurredAt: new Date(),
  };
}

export const useNewRecordStore = create<NewRecordState>((set) => ({
  ...getInitialState(),
  setField: (key, value) => set({ [key]: value }),
  selectQuadrant: (quadrant) =>
    set((state) => ({
      quadrant,
      emotion: state.quadrant === quadrant ? state.emotion : null,
      stepIndex: 1,
      direction: 1,
    })),
  selectEmotion: (emotion, quadrant) => set({ emotion, quadrant }),
  toggleContextTag: (group, tag) =>
    set((state) => {
      const current = state.context[group];
      const next = current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag];

      return { context: { ...state.context, [group]: next } };
    }),
  saveBodySensation: (sensation) =>
    set((state) => {
      const exists = state.bodySensations.some((item) => item.id === sensation.id);

      return {
        bodySensations: exists
          ? state.bodySensations.map((item) =>
              item.id === sensation.id ? sensation : item,
            )
          : [...state.bodySensations, sensation],
      };
    }),
  removeBodySensation: (id) =>
    set((state) => ({
      bodySensations: state.bodySensations.filter((item) => item.id !== id),
    })),
  nextStep: () =>
    set((state) => ({
      stepIndex: Math.min(state.stepIndex + 1, NEW_RECORD_STEPS.length - 1),
      direction: 1,
    })),
  previousStep: () =>
    set((state) => ({ stepIndex: Math.max(0, state.stepIndex - 1), direction: -1 })),
  reset: () => set(getInitialState()),
}));
