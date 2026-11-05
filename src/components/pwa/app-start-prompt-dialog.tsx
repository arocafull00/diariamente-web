"use client";

import { LoaderCircle } from "lucide-react";

import type { AppStartPromptCopy } from "@/components/pwa/app-start-prompts-content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AppStartPromptDialogProps = {
  open: boolean;
  copy: AppStartPromptCopy;
  pending: boolean;
  preview: React.ReactNode;
  onAccept: () => void;
  onDismiss: () => void;
};

export function AppStartPromptDialog({
  open,
  copy,
  pending,
  preview,
  onAccept,
  onDismiss,
}: AppStartPromptDialogProps) {
  const Icon = copy.icon;

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen || pending) {
      return;
    }

    onDismiss();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-5 rounded-[2rem] bg-card p-5 shadow-xl ring-border/50 sm:max-w-sm">
        <div
          className={cn(
            "flex min-h-40 items-center justify-center rounded-3xl px-5 py-7",
            copy.panelClassName,
          )}
        >
          {preview}
        </div>
        <DialogHeader className="items-center gap-2 px-1 text-center">
          <DialogTitle className="font-display text-2xl leading-tight font-medium text-balance">
            {copy.title}{" "}
            <span className={cn("italic", copy.accentClassName)}>{copy.highlight}</span>
          </DialogTitle>
          <DialogDescription className="max-w-xs text-base leading-6">
            {copy.description}
          </DialogDescription>
          <p className="max-w-xs text-xs text-muted-foreground">{copy.note}</p>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          <Button size="lg" className="w-full" disabled={pending} onClick={onAccept}>
            {pending ? (
              <LoaderCircle
                className="animate-spin"
                data-icon="inline-start"
                aria-hidden="true"
              />
            ) : (
              <Icon data-icon="inline-start" aria-hidden="true" />
            )}
            {copy.action}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-muted-foreground"
            disabled={pending}
            onClick={onDismiss}
          >
            Ahora no
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
