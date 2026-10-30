"use client";

import { createPortal } from "react-dom";

import { useVisualViewportFrame } from "@/components/records/use-visual-viewport-frame";
import type { MoodQuadrant } from "@/db/schema";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type RecordEditorOverlayProps = {
  palette: MoodQuadrant | null;
  children: React.ReactNode;
};

export function RecordEditorOverlay({ palette, children }: RecordEditorOverlayProps) {
  const viewportFrame = useVisualViewportFrame();

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={viewportFrame}
      className="fixed inset-0 z-60 flex flex-col bg-background"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-colors duration-700",
          getMoodStyles(palette).soft,
        )}
        aria-hidden="true"
      />
      {children}
    </div>,
    document.body,
  );
}
