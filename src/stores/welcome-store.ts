import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WelcomeState = {
  seenProfileIds: string[];
  markSeen: (profileId: string) => void;
};

export const useWelcomeStore = create<WelcomeState>()(
  persist(
    (set) => ({
      seenProfileIds: [],
      markSeen: (profileId) =>
        set((state) =>
          state.seenProfileIds.includes(profileId)
            ? state
            : { seenProfileIds: [...state.seenProfileIds, profileId] },
        ),
    }),
    {
      name: "diariamente-welcome",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ seenProfileIds: state.seenProfileIds }),
    },
  ),
);
