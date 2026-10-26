"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useSyncExternalStore } from "react";

import type { UserRole } from "@/db/schema";
import { readLastActivity, writeLastActivity } from "@/lib/last-activity";
import { IDLE_SIGN_OUT_MINUTES } from "@/lib/privacy";

import { useSignOut } from "./use-sign-out";

const CHECK_INTERVAL_MS = 60 * 1000;
const WRITE_THROTTLE_MS = 30 * 1000;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"];

function isIdleExpired(
  userId: string,
  timeoutMs: number,
  sessionId: string | null | undefined,
) {
  const last = readLastActivity();

  if (!last || last.userId !== userId) {
    return false;
  }

  if (sessionId && last.sessionId !== sessionId) {
    return false;
  }

  return Date.now() - last.at > timeoutMs;
}

function subscribeToIdleChecks(onStoreChange: () => void) {
  const interval = window.setInterval(onStoreChange, CHECK_INTERVAL_MS);
  window.addEventListener("storage", onStoreChange);
  document.addEventListener("visibilitychange", onStoreChange);

  return () => {
    window.clearInterval(interval);
    window.removeEventListener("storage", onStoreChange);
    document.removeEventListener("visibilitychange", onStoreChange);
  };
}

export function useIdleSignOut(profile: { id: string; role: UserRole } | null) {
  const { isLoaded, sessionId } = useAuth();
  const signOut = useSignOut();
  const userId = profile?.id;
  const timeoutMs = profile ? IDLE_SIGN_OUT_MINUTES[profile.role] * 60 * 1000 : 0;
  const expired = useSyncExternalStore(
    subscribeToIdleChecks,
    () => (userId ? isIdleExpired(userId, timeoutMs, sessionId) : false),
    () => false,
  );

  useEffect(() => {
    if (!expired || !isLoaded || !sessionId) {
      return;
    }

    void signOut();
  }, [expired, isLoaded, sessionId, signOut]);

  useEffect(() => {
    if (!userId || !sessionId || expired) {
      return;
    }

    const activeUserId = userId;
    const activeSessionId = sessionId;
    let lastWrite = 0;

    function recordActivity() {
      const now = Date.now();

      if (now - lastWrite < WRITE_THROTTLE_MS) {
        return;
      }

      if (isIdleExpired(activeUserId, timeoutMs, activeSessionId)) {
        return;
      }

      lastWrite = now;
      writeLastActivity({ userId: activeUserId, sessionId: activeSessionId, at: now });
    }

    recordActivity();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, recordActivity, { passive: true });
    }

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, recordActivity);
      }
    };
  }, [expired, sessionId, timeoutMs, userId]);

  return expired;
}
