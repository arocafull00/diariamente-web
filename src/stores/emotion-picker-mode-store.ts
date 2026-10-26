import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type EmotionPickerMode = "field" | "tree";

type EmotionPickerModeState = {
  mode: EmotionPickerMode;
  toggleMode: () => void;
};

export const useEmotionPickerModeStore = create<EmotionPickerModeState>()(
  persist(
    (set) => ({
      mode: "field",
      toggleMode: () =>
        set((state) => ({ mode: state.mode === "field" ? "tree" : "field" })),
    }),
    {
      name: "diariamente-emotion-picker-mode",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);
