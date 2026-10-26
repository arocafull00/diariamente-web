"use client";

import { useClerk } from "@clerk/nextjs";
import { useCallback } from "react";

import { clearAppShell } from "@/lib/app-shell-cache";
import { clearLastActivity } from "@/lib/last-activity";
import { useScreenCacheStore } from "@/stores/screen-cache-store";
import { useSessionStore } from "@/stores/session-store";

export function useSignOut() {
  const { signOut } = useClerk();
  const clearScreenCache = useScreenCacheStore((state) => state.clear);
  const clearSession = useSessionStore((state) => state.clear);

  return useCallback(async () => {
    clearAppShell();
    clearLastActivity();
    await signOut({ redirectUrl: "/login" });
    clearScreenCache();
    clearSession();
  }, [clearScreenCache, clearSession, signOut]);
}
