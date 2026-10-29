"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";

import { Face } from "@/components/faces/face";
import type { WelcomeGoal } from "@/components/onboarding/welcome-content";
import { WELCOME_TONE_CLASSES } from "@/components/onboarding/welcome-tones";
import { cn } from "@/lib/utils";

type WelcomeGoalOptionProps = {
  goal: WelcomeGoal;
  selected: boolean;
  onSelect: (goalId: string) => void;
};

export function WelcomeGoalOption({
  goal,
  selected,
  onSelect,
}: WelcomeGoalOptionProps) {
  return (
    <li>
      <motion.button
        type="button"
        role="radio"
        data-cuelume-select=""
        aria-checked={selected}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className={cn(
          "flex w-full items-center gap-4 rounded-2xl border-2 border-b-4 px-4 py-3 text-left font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          selected
            ? WELCOME_TONE_CLASSES[goal.tone].selected
            : "border-border bg-card hover:bg-muted/60",
        )}
        onClick={() => onSelect(goal.id)}
      >
        <Face
          faceId={goal.faceId}
          size={64}
          className={cn(
            "size-11 shrink-0 transition-transform",
            selected && "scale-110 -rotate-6",
          )}
        />
        <span className="min-w-0 flex-1">{goal.label}</span>
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border",
          )}
          aria-hidden="true"
        >
          {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
        </span>
      </motion.button>
    </li>
  );
}
