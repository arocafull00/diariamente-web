"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getNavItems } from "@/components/app-shell/nav-items";
import type { AppStartPromptId } from "@/components/pwa/app-start-prompts-content";
import { useEnableNotifications } from "@/components/pwa/use-enable-notifications";
import type { UserRole } from "@/db/schema";
import { usePwaInstall } from "@/hooks/use-pwa-install";

const PROMPT_DELAY_MS = 900;
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const DISMISSED_KEYS: Record<AppStartPromptId, string> = {
  notifications: "diariamente:prompt-dismissed:notifications",
  install: "diariamente:prompt-dismissed:install",
};

function wasDismissedRecently(prompt: AppStartPromptId) {
  try {
    const dismissedAt = Number(localStorage.getItem(DISMISSED_KEYS[prompt]));
    return dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function rememberDismissal(prompt: AppStartPromptId) {
  try {
    localStorage.setItem(DISMISSED_KEYS[prompt], String(Date.now()));
  } catch {
    return;
  }
}

async function canPromptNotifications() {
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window) ||
    Notification.permission === "denied"
  ) {
    return false;
  }

  if (Notification.permission === "default") {
    return true;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  return !(await registration?.pushManager.getSubscription());
}

export function useAppStartPrompts(role: UserRole) {
  const pathname = usePathname();
  const isHome = pathname === getNavItems(role)[0].href;
  const offersNotifications = role === "patient" || role === "psychologist";
  const notifications = useEnableNotifications(role);
  const install = usePwaInstall();
  const [queue, setQueue] = useState<AppStartPromptId[]>([]);
  const evaluated = useRef(false);

  useEffect(() => {
    if (!isHome || evaluated.current) {
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      const pending: AppStartPromptId[] = [];

      if (
        offersNotifications &&
        !wasDismissedRecently("notifications") &&
        (await canPromptNotifications().catch(() => false))
      ) {
        pending.push("notifications");
      }

      if (!wasDismissedRecently("install")) {
        pending.push("install");
      }

      if (cancelled) {
        return;
      }

      evaluated.current = true;
      setQueue(pending);
    }, PROMPT_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isHome, offersNotifications]);

  const current =
    queue.find((prompt) => prompt !== "install" || !install.installed) ?? null;

  function close(prompt: AppStartPromptId) {
    setQueue((pending) => pending.filter((item) => item !== prompt));
  }

  function dismiss(prompt: AppStartPromptId) {
    rememberDismissal(prompt);
    close(prompt);
  }

  async function enableNotifications() {
    if (await notifications.activate()) {
      close("notifications");
    }
  }

  async function startInstall() {
    await install.handleInstall();
    dismiss("install");
  }

  return {
    current,
    dismiss,
    enableNotifications,
    notificationsPending: notifications.loading,
    startInstall,
    installPending: install.loading,
    installGuide: {
      open: install.guideOpen,
      onOpenChange: install.setGuideOpen,
      platform: install.platform,
    },
  };
}
