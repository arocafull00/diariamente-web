import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SoundState = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      enabled: true,
      setEnabled: (enabled) => set({ enabled }),
    }),
    {
      name: "diariamente-sound",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ enabled: state.enabled }),
    },
  ),
);
