"use client";

import { ArrowLeft, X } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type NewRecordTopBarProps = {
  phase: number;
  phaseCount: number;
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
};

export function NewRecordTopBar({
  phase,
  phaseCount,
  canGoBack,
  onBack,
  onClose,
}: NewRecordTopBarProps) {
  return (
    <div className="relative z-20 flex h-16 shrink-0 items-center justify-between px-4 pt-[env(safe-area-inset-top)] lg:px-8">
      <button
        type="button"
        onClick={canGoBack ? onBack : onClose}
        data-cuelume-tap={canGoBack ? "type" : "close"}
        aria-label={canGoBack ? "Volver al paso anterior" : "Cerrar"}
        className="flex size-11 items-center justify-center rounded-full bg-card/80 shadow-sm backdrop-blur outline-none transition-transform active:scale-90 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {canGoBack ? (
          <ArrowLeft className="size-5" aria-hidden="true" />
        ) : (
          <X className="size-5" aria-hidden="true" />
        )}
      </button>

      <div
        className="flex items-center gap-1.5"
        role="progressbar"
        aria-label="Progreso del registro"
        aria-valuemin={1}
        aria-valuemax={phaseCount}
        aria-valuenow={phase + 1}
      >
        {Array.from({ length: phaseCount }, (_, index) => (
          <motion.span
            key={index}
            initial={false}
            className={cn(
              "h-1.5 rounded-full",
              index <= phase ? "bg-foreground" : "bg-foreground/15",
            )}
            animate={{ width: index === phase ? 24 : 6 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        ))}
      </div>

      {canGoBack ? (
        <button
          type="button"
          onClick={onClose}
          data-cuelume-close=""
          aria-label="Cerrar"
          className="flex size-11 items-center justify-center rounded-full bg-card/80 shadow-sm backdrop-blur outline-none transition-transform active:scale-90 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      ) : (
        <span className="size-11" aria-hidden="true" />
      )}
    </div>
  );
}
