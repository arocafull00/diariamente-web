"use client";

import { PwaInstallButton } from "@/components/pwa/pwa-install-button";

export function WelcomeInstallStep() {
  return (
    <div className="space-y-3">
      <PwaInstallButton />
      <p className="px-1 text-sm text-foreground/65">
        También puedes instalarla más tarde desde Ajustes.
      </p>
    </div>
  );
}
