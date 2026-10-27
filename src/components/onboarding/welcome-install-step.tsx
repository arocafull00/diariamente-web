"use client";

import Image from "next/image";

import logo from "../../../public/logo.png";

import { PwaInstallGuide } from "@/components/pwa/pwa-install-guide";
import type { InstallPlatform } from "@/lib/install-platform";

type WelcomeInstallStepProps = {
  guideOpen: boolean;
  onGuideOpenChange: (open: boolean) => void;
  platform: InstallPlatform;
};

export function WelcomeInstallStep({
  guideOpen,
  onGuideOpenChange,
  platform,
}: WelcomeInstallStepProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div aria-hidden="true" className="flex flex-col items-center gap-2">
        <span className="flex size-24 items-center justify-center rounded-[1.75rem] border-2 border-border bg-card shadow-md motion-safe:animate-mood-float">
          <Image src={logo} alt="" width={72} height={72} className="size-16 object-contain" />
        </span>
        <span className="text-sm font-semibold">Diariamente</span>
      </div>
      <p className="px-1 text-center text-sm text-foreground/65">
        También puedes instalarla más tarde desde Ajustes.
      </p>
      <PwaInstallGuide
        open={guideOpen}
        onOpenChange={onGuideOpenChange}
        platform={platform}
      />
    </div>
  );
}
