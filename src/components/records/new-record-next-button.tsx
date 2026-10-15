"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type NewRecordNextButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

export function NewRecordNextButton({
  onClick,
  disabled = false,
  label = "Continuar",
  className,
}: NewRecordNextButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      whileTap={{ scale: 0.88 }}
      className={cn(
        "flex size-14 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-lg outline-none transition-opacity focus-visible:ring-4 focus-visible:ring-ring/50 disabled:opacity-30",
        className,
      )}
    >
      <ArrowRight className="size-6" aria-hidden="true" />
    </motion.button>
  );
}
