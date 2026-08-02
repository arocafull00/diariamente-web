import type { RecordEmotion } from "@/db/schema";
import { create } from "zustand";

type NewRecordState = {
  step: number;
  occurredAt: Date;
  situation: string;
  thoughts: string;
  behaviours: string;
  emotions: RecordEmotion[];
  setField: <K extends keyof Omit<NewRecordState, "setField" | "nextStep" | "previousStep" | "reset">>(
    key: K,
    value: NewRecordState[K],
  ) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
};

const initialState = {
  step: 0,
  occurredAt: new Date(),
  situation: "",
  thoughts: "",
  behaviours: "",
  emotions: [] as RecordEmotion[],
};

export const useNewRecordStore = create<NewRecordState>((set) => ({
  ...initialState,
  setField: (key, value) => set({ [key]: value }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  previousStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),
  reset: () => set({ ...initialState, occurredAt: new Date() }),
}));
