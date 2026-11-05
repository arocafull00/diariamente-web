"use client";

import { AppIconPreview } from "@/components/pwa/app-icon-preview";
import { AppStartPromptDialog } from "@/components/pwa/app-start-prompt-dialog";
import {
  INSTALL_PROMPT,
  NOTIFICATION_PROMPTS,
} from "@/components/pwa/app-start-prompts-content";
import { NotificationPreview } from "@/components/pwa/notification-preview";
import { PwaInstallGuide } from "@/components/pwa/pwa-install-guide";
import { useAppStartPrompts } from "@/components/pwa/use-app-start-prompts";
import type { UserRole } from "@/db/schema";

type AppStartPromptsProps = {
  role: UserRole;
};

export function AppStartPrompts({ role }: AppStartPromptsProps) {
  const {
    current,
    dismiss,
    enableNotifications,
    notificationsPending,
    startInstall,
    installPending,
    installGuide,
  } = useAppStartPrompts(role);
  const notificationPrompt =
    NOTIFICATION_PROMPTS[role === "patient" ? "patient" : "psychologist"];

  return (
    <>
      <AppStartPromptDialog
        open={current === "notifications"}
        copy={notificationPrompt}
        pending={notificationsPending}
        preview={
          <NotificationPreview
            title={notificationPrompt.preview.title}
            body={notificationPrompt.preview.body}
          />
        }
        onAccept={enableNotifications}
        onDismiss={() => dismiss("notifications")}
      />
      <AppStartPromptDialog
        open={current === "install"}
        copy={INSTALL_PROMPT}
        pending={installPending}
        preview={<AppIconPreview />}
        onAccept={startInstall}
        onDismiss={() => dismiss("install")}
      />
      <PwaInstallGuide
        open={installGuide.open}
        onOpenChange={installGuide.onOpenChange}
        platform={installGuide.platform}
      />
    </>
  );
}
