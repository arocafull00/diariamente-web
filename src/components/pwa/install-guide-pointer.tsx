"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { createPortal } from "react-dom";

import type { InstallGuidePointer as Pointer } from "@/components/pwa/install-guide-content";
import { cn } from "@/lib/utils";

const positionClassNames: Record<Pointer, string> = {
  "top-right": "top-2 right-3 flex-col-reverse items-end",
  "bottom-center": "bottom-2 left-1/2 -translate-x-1/2 flex-col items-center",
  "bottom-right": "bottom-2 right-3 flex-col items-end",
};

type InstallGuidePointerProps = {
  position: Pointer;
  label: string;
};

export function InstallGuidePointer({ position, label }: InstallGuidePointerProps) {
  const Arrow = position === "top-right" ? ArrowUp : ArrowDown;

  return createPortal(
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed z-[60] flex gap-1 mb-[env(safe-area-inset-bottom)]",
        positionClassNames[position],
      )}
    >
      <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-lg">
        {label}
      </span>
      <span className="flex size-10 animate-bounce items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
        <Arrow className="size-5" />
      </span>
    </div>,
    document.body,
  );
}
