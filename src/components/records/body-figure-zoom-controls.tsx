"use client";

import { ZoomIn, ZoomOut } from "lucide-react";

import { cn } from "@/lib/utils";

type BodyFigureZoomControlsProps = {
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  className?: string;
};

const BUTTON_CLASS_NAME =
  "flex size-11 items-center justify-center outline-none transition-[opacity,transform] active:scale-90 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-30";

export function BodyFigureZoomControls({
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  className,
}: BodyFigureZoomControlsProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-full bg-card/90 shadow-sm ring-1 ring-border/60 backdrop-blur",
        className,
      )}
    >
      <button
        type="button"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        aria-label="Acercar"
        className={BUTTON_CLASS_NAME}
      >
        <ZoomIn className="size-5" aria-hidden="true" />
      </button>
      <span className="mx-2 h-px bg-border" aria-hidden="true" />
      <button
        type="button"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        aria-label="Alejar"
        className={BUTTON_CLASS_NAME}
      >
        <ZoomOut className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}
