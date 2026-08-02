"use client";

import { Check } from "lucide-react";

import { getEmotionColor } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type EmotionChipProps = {
  emotion: string;
  selected: boolean;
  onClick: () => void;
};

export function EmotionChip({ emotion, selected, onClick }: EmotionChipProps) {
  const colors = getEmotionColor(emotion);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-base font-semibold transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "opacity-90 hover:opacity-100",
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {selected ? <Check className="size-4 shrink-0" aria-hidden="true" /> : null}
      {emotion}
    </button>
  );
}
