"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppLoading } from "@/components/app-shell/app-loading";
import { AppShell } from "@/components/app-shell/app-shell";
import {
  patientItems,
  psychologistItems,
} from "@/components/app-shell/nav-items";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { cacheAppShell, clearAppShell } from "@/lib/app-shell-cache";
import { getSessionProfile } from "@/server/actions/session";
import { useScreenCacheStore } from "@/stores/screen-cache-store";
import { useSessionStore } from "@/stores/session-store";

type AppSessionGateProps = {
  refreshedAt: number;
  children: React.ReactNode;
};

export function AppSessionGate({ refreshedAt, children }: AppSessionGateProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const isOnline = useOnlineStatus();
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
    if (!hasHydrated || !isLoaded || !isOnline) {
      return;
    }

    function signOutLocally(redirectTo: string) {
      clearSession();
      clearScreenCache();
      clearAppShell();
      router.replace(redirectTo);
    }

    if (!isSignedIn) {
      signOutLocally("/login");
      return;
    }

    getToken()
      .then(() => getSessionProfile())
      .then((result) => {
        if (result.status === "signed-in") {
          const items =
            result.profile.role === "patient" ? patientItems : psychologistItems;

          setProfile(result.profile);
          cacheAppShell(
            items[0].href,
            items.map((item) => item.href),
          );
          return;
        }

        signOutLocally(result.status === "signed-out" ? "/login" : "/onboarding");
      })
      .catch(() => {});
  }, [
    clearScreenCache,
    clearSession,
    getToken,
    hasHydrated,
    isLoaded,
    isOnline,
    isSignedIn,
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
