import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  getHomeScreenData,
  getMyRecordsScreenData,
  getProfileScreenData,
} from "@/server/actions/screen-data";

export type ScreenData = {
  home: Awaited<ReturnType<typeof getHomeScreenData>>;
  records: Awaited<ReturnType<typeof getMyRecordsScreenData>>;
  profile: Awaited<ReturnType<typeof getProfileScreenData>>;
};

export type ScreenKey = keyof ScreenData;

type ScreenCacheEntry<K extends ScreenKey> = {
  ownerId: string;
  data: ScreenData[K];
};

type ScreenCacheEntries = { [K in ScreenKey]?: ScreenCacheEntry<K> };

type ScreenCacheState = {
  entries: ScreenCacheEntries;
  hasHydrated: boolean;
  setEntry: <K extends ScreenKey>(key: K, entry: ScreenCacheEntry<K>) => void;
  clear: () => void;
};

const DATE_MARKER = "__date";

function replaceDates(this: Record<string, unknown>, key: string, value: unknown) {
  const raw = this[key];

  if (raw instanceof Date) {
    return { [DATE_MARKER]: raw.toISOString() };
  }

  return value;
}

function reviveDates(_key: string, value: unknown) {
  if (value && typeof value === "object" && DATE_MARKER in value) {
    return new Date((value as Record<typeof DATE_MARKER, string>)[DATE_MARKER]);
  }

  return value;
}

export const useScreenCacheStore = create<ScreenCacheState>()(
  persist(
    (set) => ({
      entries: {},
      hasHydrated: false,
      setEntry: (key, entry) =>
        set((state) => ({ entries: { ...state.entries, [key]: entry } })),
      clear: () => set({ entries: {} }),
    }),
    {
      name: "diariamente-screen-cache",
      version: 1,
      storage: createJSONStorage(() => localStorage, {
        replacer: replaceDates,
        reviver: reviveDates,
      }),
      partialize: (state) => ({ entries: state.entries }),
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useScreenCacheStore.setState({ hasHydrated: true });
      },
    },
  ),
);
