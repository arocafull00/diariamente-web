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
        "flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg outline-none transition-[opacity,background-color] hover:bg-brand-primary-dark focus-visible:ring-4 focus-visible:ring-ring/50 disabled:opacity-30",
        className,
      )}
    >
      <ArrowRight className="size-6" aria-hidden="true" />
    </motion.button>
  );
}
