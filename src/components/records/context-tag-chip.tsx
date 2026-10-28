"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";

import type { MoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type ContextTagChipProps = {
  label: string;
  selected: boolean;
  styles: MoodStyles;
  onToggle: () => void;
};

export function ContextTagChip({
  label,
  selected,
  styles,
  onToggle,
}: ContextTagChipProps) {
  return (
    <motion.button
      type="button"
      data-cuelume-toggle=""
      layout
      onClick={onToggle}
      aria-pressed={selected}
      whileTap={{ scale: 0.92 }}
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? cn(styles.soft, styles.strong, "ring-2", styles.ring)
          : "bg-card text-foreground ring-1 ring-border hover:bg-secondary",
      )}
    >
      {selected ? <Check className="size-4" aria-hidden="true" /> : null}
      {label}
    </motion.button>
  );
}
