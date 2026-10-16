"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import {
  useScreenCacheStore,
  type ScreenData,
  type ScreenKey,
} from "@/stores/screen-cache-store";
import { useSessionStore } from "@/stores/session-store";

export function useCachedScreen<K extends ScreenKey>(
  key: K,
  load: () => Promise<ScreenData[K]>,
  refreshedAt: number,
) {
  const userId = useSessionStore((state) => state.profile?.id);
  const entry = useScreenCacheStore((state) => state.entries[key]);
  const hasHydrated = useScreenCacheStore((state) => state.hasHydrated);
  const setEntry = useScreenCacheStore((state) => state.setEntry);

  useEffect(() => {
    if (!userId || !hasHydrated) {
      return;
    }

    load()
      .then((data) => {
        if (!data) {
          return;
        }

        setEntry(key, { ownerId: userId, data });
      })
      .catch(() => {
        toast.error("No se pudieron actualizar los datos");
      });
  }, [hasHydrated, key, load, refreshedAt, setEntry, userId]);

  const data = entry && entry.ownerId === userId ? entry.data : null;

  return { data, hasHydrated };
}
