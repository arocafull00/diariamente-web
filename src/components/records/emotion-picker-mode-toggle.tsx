"use client";

import type { EmotionPickerMode } from "@/stores/emotion-picker-mode-store";

type EmotionPickerModeToggleProps = {
  mode: EmotionPickerMode;
  onToggle: () => void;
};

export function EmotionPickerModeToggle({
  mode,
  onToggle,
}: EmotionPickerModeToggleProps) {
  return (
    <button
      type="button"
      data-cuelume-tap=""
      onClick={onToggle}
      className="pressable rounded-full px-3 py-2 text-sm font-medium text-muted-foreground outline-none hover:bg-secondary hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {mode === "field" ? "Cambiar a vista simplificada" : "Cambiar a vista completa"}
    </button>
  );
}
