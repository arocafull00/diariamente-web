import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  AcquisitionSource,
  Caseload,
  GrammaticalGender,
  OnboardingGoal,
  RecordsExperience,
  TherapyStatus,
} from "@/db/schema";

export type OnboardingRole = "patient" | "psychologist" | "clinic";

export type OnboardingAnswers = {
  role: OnboardingRole | null;
  firstName: string;
  lastName: string;
  clinicName: string;
  grammaticalGender: GrammaticalGender | null;
  avatarUrl: string | null;
  acquisitionSource: AcquisitionSource | null;
  goal: OnboardingGoal | null;
  therapyStatus: TherapyStatus | null;
  recordsExperience: RecordsExperience | null;
  caseload: Caseload | null;
  legalAccepted: boolean;
  submitRequested: boolean;
};

type OnboardingState = {
  answers: OnboardingAnswers;
  hasHydrated: boolean;
  setAnswer: <K extends keyof OnboardingAnswers>(
    key: K,
    value: OnboardingAnswers[K],
  ) => void;
  reset: () => void;
};

const INITIAL_ANSWERS: OnboardingAnswers = {
  role: null,
  firstName: "",
  lastName: "",
  clinicName: "",
  grammaticalGender: null,
  avatarUrl: null,
  acquisitionSource: null,
  goal: null,
  therapyStatus: null,
  recordsExperience: null,
  caseload: null,
  legalAccepted: false,
  submitRequested: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      answers: INITIAL_ANSWERS,
      hasHydrated: false,
      setAnswer: (key, value) =>
        set((state) => ({ answers: { ...state.answers, [key]: value } })),
      reset: () => set({ answers: INITIAL_ANSWERS }),
    }),
    {
      name: "diariamente-onboarding",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ answers: state.answers }),
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useOnboardingStore.setState({ hasHydrated: true });
      },
    },
  ),
);
