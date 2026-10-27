"use client";

import { ArrowLeft, X } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

type WelcomeTopBarProps = {
  progress: number;
  showBack: boolean;
  showSkip: boolean;
  disabled: boolean;
  onBack: () => void;
  onSkip: () => void;
};

export function WelcomeTopBar({
  progress,
  showBack,
  showSkip,
  disabled,
  onBack,
  onSkip,
}: WelcomeTopBarProps) {
  return (
    <header className="flex items-center gap-3">
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        aria-label="Atrás"
        className={showBack ? "text-foreground/65" : "invisible"}
        disabled={disabled || !showBack}
        onClick={onBack}
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </Button>

      <div
        role="progressbar"
        aria-label="Progreso de la bienvenida"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="h-3.5 flex-1 overflow-hidden rounded-full bg-foreground/10"
      >
        <motion.div
          className="relative h-full rounded-full bg-mood-lp-3"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
        >
          <span className="absolute inset-x-2 top-1 h-1 rounded-full bg-card/45" />
        </motion.div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        aria-label="Saltar la bienvenida"
        className={showSkip ? "text-foreground/65" : "invisible"}
        disabled={disabled || !showSkip}
        onClick={onSkip}
      >
        <X className="size-5" aria-hidden="true" />
      </Button>
    </header>
  );
}
