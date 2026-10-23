"use client";

import { installGuides } from "@/components/pwa/install-guide-content";
import { InstallGuideActions } from "@/components/pwa/install-guide-actions";
import { InstallGuidePointer } from "@/components/pwa/install-guide-pointer";
import { InstallGuideStep } from "@/components/pwa/install-guide-step";
import { InstallGuideToolbar } from "@/components/pwa/install-guide-toolbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { InstallPlatform } from "@/lib/install-platform";

type PwaInstallGuideProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: InstallPlatform;
};

export function PwaInstallGuide({ open, onOpenChange, platform }: PwaInstallGuideProps) {
  const guide = installGuides[platform];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5">
        <DialogHeader>
          <DialogTitle>{guide.title}</DialogTitle>
          <DialogDescription>{guide.description}</DialogDescription>
        </DialogHeader>
        {guide.toolbar && <InstallGuideToolbar toolbar={guide.toolbar} />}
        <ol className="space-y-3">
          {guide.steps.map((step, index) => (
            <InstallGuideStep
              key={step.text}
              number={index + 1}
              icon={step.icon}
              text={step.text}
            />
          ))}
        </ol>
        {guide.hint && <p className="text-xs text-muted-foreground">{guide.hint}</p>}
        <InstallGuideActions action={guide.action} />
      </DialogContent>
      {open && guide.pointer && (
        <InstallGuidePointer
          position={guide.pointer.position}
          label={guide.pointer.label}
        />
      )}
    </Dialog>
  );
}
