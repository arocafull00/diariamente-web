import { clearAppShell } from "@/lib/app-shell-cache";
import { logger } from "@/lib/logger";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useScreenCacheStore } from "@/stores/screen-cache-store";
import { useSessionStore } from "@/stores/session-store";

const SIGN_OUT_TIMEOUT_MS = 3000;

export async function signOutAndLeave(signOut: (() => Promise<unknown>) | null) {
  clearAppShell();
  logger.identify(null);
  useScreenCacheStore.getState().clear();
  useSessionStore.getState().clear();
  useOnboardingStore.getState().reset();
  useOnboardingStore.persist.clearStorage();

  if (signOut) {
    await Promise.race([
      signOut().catch(() => undefined),
      new Promise((resolve) => setTimeout(resolve, SIGN_OUT_TIMEOUT_MS)),
    ]);
  }

  window.location.assign("/empezar");
}
