"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppLoading } from "@/components/app-shell/app-loading";
import { AppShell } from "@/components/app-shell/app-shell";
import { getSessionProfile } from "@/server/actions/session";
import { useScreenCacheStore } from "@/stores/screen-cache-store";
import { useSessionStore } from "@/stores/session-store";

type AppSessionGateProps = {
  refreshedAt: number;
  children: React.ReactNode;
};

export function AppSessionGate({ refreshedAt, children }: AppSessionGateProps) {
  const router = useRouter();
  const isLoggedIn = useSessionStore((state) => state.isLoggedIn);
  const profile = useSessionStore((state) => state.profile);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const setProfile = useSessionStore((state) => state.setProfile);
  const clearSession = useSessionStore((state) => state.clear);
  const clearScreenCache = useScreenCacheStore((state) => state.clear);

  useEffect(() => {
    if (!useSessionStore.persist.hasHydrated()) {
      useSessionStore.persist.rehydrate();
    }

    if (!useScreenCacheStore.persist.hasHydrated()) {
      useScreenCacheStore.persist.rehydrate();
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    getSessionProfile()
      .then((result) => {
        if (result.status === "signed-in") {
          setProfile(result.profile);
          return;
        }

        clearSession();
        clearScreenCache();
        router.replace(result.status === "signed-out" ? "/login" : "/onboarding");
      })
      .catch(() => {});
  }, [
    clearScreenCache,
    clearSession,
    hasHydrated,
    refreshedAt,
    router,
    setProfile,
  ]);

  if (!hasHydrated) {
    return null;
  }

  if (!isLoggedIn || !profile) {
    return <AppLoading />;
  }

  return <AppShell profile={profile}>{children}</AppShell>;
}
