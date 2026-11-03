"use client";

import { useClerk } from "@clerk/nextjs";
import { useCallback } from "react";

import { clearAppShell } from "@/lib/app-shell-cache";
import { clearLastActivity } from "@/lib/last-activity";
import { logger } from "@/lib/logger";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useScreenCacheStore } from "@/stores/screen-cache-store";
import { useSessionStore } from "@/stores/session-store";

const SIGN_OUT_TIMEOUT_MS = 3000;

export function useSignOut() {
  const clerk = useClerk();
  const clearScreenCache = useScreenCacheStore((state) => state.clear);
  const clearSession = useSessionStore((state) => state.clear);

  return useCallback(async () => {
    clearAppShell();
    clearLastActivity();
    logger.identify(null);
    clearScreenCache();
    clearSession();
    useOnboardingStore.getState().reset();
    useOnboardingStore.persist.clearStorage();

    if (clerk.session) {
      await Promise.race([
        clerk.signOut(),
        new Promise((resolve) => setTimeout(resolve, SIGN_OUT_TIMEOUT_MS)),
      ]);
    }

    window.location.assign("/empezar");
  }, [clearScreenCache, clearSession, clerk]);
}
