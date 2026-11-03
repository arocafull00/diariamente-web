"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";

import { Illustration } from "@/components/faces/illustration";
import type { OnboardingChoice } from "@/components/onboarding/onboarding-content";
import { WELCOME_TONE_CLASSES } from "@/components/onboarding/welcome-tones";
import { cn } from "@/lib/utils";

type OnboardingChoiceOptionProps<T extends string> = {
  choice: OnboardingChoice<T>;
  selected: boolean;
  compact: boolean;
  onSelect: (value: T) => void;
};

export function OnboardingChoiceOption<T extends string>({
  choice,
  selected,
  compact,
  onSelect,
}: OnboardingChoiceOptionProps<T>) {
  const { icon, tone } = choice;
  const toneClasses = WELCOME_TONE_CLASSES[tone];

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
          "flex h-full w-full items-center rounded-2xl border-2 border-b-4 text-left font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          compact ? "flex-col items-start gap-2 px-3 py-3" : "gap-4 px-4 py-3.5",
          selected ? toneClasses.selected : "border-border bg-card hover:bg-muted/60",
        )}
        onClick={() => onSelect(choice.value)}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-2xl transition-transform",
            compact ? "size-9" : "size-11",
            selected && "-rotate-6",
          )}
        >
          <Illustration name={icon} className={compact ? "size-9" : "size-11"} />
        </span>
        <span className={cn("min-w-0 flex-1", compact && "w-full")}>
          <span className="block leading-5">{choice.label}</span>
        </span>
        {compact ? null : (
          <span
            aria-hidden="true"
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              selected ? toneClasses.check : "border-border",
            )}
          >
            {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
          </span>
        )}
      </motion.button>
    </li>
  );
}
