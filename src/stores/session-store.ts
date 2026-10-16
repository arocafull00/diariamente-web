import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Profile, UserRole } from "@/db/schema";

type SessionProfile = Pick<Profile, "id" | "firstName" | "lastName" | "avatarUrl"> & {
  role: UserRole;
};

type SessionState = {
  isLoggedIn: boolean;
  profile: SessionProfile | null;
  hasHydrated: boolean;
  setProfile: (profile: SessionProfile) => void;
  clear: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      profile: null,
      hasHydrated: false,
      setProfile: (profile) => set({ isLoggedIn: true, profile }),
      clear: () => set({ isLoggedIn: false, profile: null }),
    }),
    {
      name: "diariamente-session",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        profile: state.profile,
      }),
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useSessionStore.setState({ hasHydrated: true });
      },
    },
  ),
);
