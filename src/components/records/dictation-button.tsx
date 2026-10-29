"use client";

import { Mic, Square } from "lucide-react";

type DictationButtonProps = {
  isListening: boolean;
  onClick: () => void;
};

export function DictationButton({ isListening, onClick }: DictationButtonProps) {
  return (
    <button
      type="button"
      data-cuelume-toggle=""
      onClick={onClick}
      aria-pressed={isListening}
      aria-label={isListening ? "Detener dictado" : "Dictar por voz"}
      className="btn-raised relative flex size-11 shrink-0 items-center justify-center rounded-full text-primary-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
    >
      {isListening ? (
        <span
          className="absolute inset-0 animate-ping rounded-full bg-primary/30"
          aria-hidden="true"
        />
      ) : null}
      {isListening ? (
        <Square className="relative size-4 fill-current" aria-hidden="true" />
      ) : (
        <Mic className="relative size-5" aria-hidden="true" />
      )}
    </button>
  );
}
