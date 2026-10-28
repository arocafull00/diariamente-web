"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { toast } from "sonner";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { logger } from "@/lib/logger";
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
  const { isSignedIn, getToken } = useAuth();
  const isOnline = useOnlineStatus();
  const userId = useSessionStore((state) => state.profile?.id);
  const entry = useScreenCacheStore((state) => state.entries[key]);
  const hasHydrated = useScreenCacheStore((state) => state.hasHydrated);
  const setEntry = useScreenCacheStore((state) => state.setEntry);

  useEffect(() => {
    if (!userId || !hasHydrated || !isSignedIn || !isOnline) {
      return;
    }

    getToken()
      .then(() => load())
      .then((data) => {
        if (!data) {
          return;
        }

        setEntry(key, { ownerId: userId, data });
      })
      .catch((error: unknown) => {
        logger.error("screen.fetch_failed", error, { screen: key });

        if (useScreenCacheStore.getState().entries[key]?.ownerId === userId) {
          return;
        }

        toast.error("No se pudieron actualizar los datos");
      });
  }, [
    getToken,
    hasHydrated,
    isOnline,
    isSignedIn,
    key,
    load,
    refreshedAt,
    setEntry,
    userId,
  ]);

  const data = entry && entry.ownerId === userId ? entry.data : null;

  return { data, hasHydrated };
}
