"use client";

import { motion } from "motion/react";

import { NewRecordNextButton } from "@/components/records/new-record-next-button";
import { NewRecordStepTitle } from "@/components/records/new-record-step-title";
import { Slider } from "@/components/ui/slider";
import type { MoodQuadrant } from "@/db/schema";
import { getMoodStyles, type MoodTone } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type NewRecordIntensityStepProps = {
  emotion: string;
  quadrant: MoodQuadrant | null;
  intensity: number;
  onChange: (intensity: number) => void;
  onContinue: () => void;
};

const INTENSITY_LABELS = [
  "Apenas",
  "Muy leve",
  "Leve",
  "Algo",
  "Moderada",
  "Notable",
  "Fuerte",
  "Muy fuerte",
  "Intensa",
  "Desbordante",
];

function getTone(intensity: number): MoodTone {
  if (intensity <= 3) {
    return 1;
  }

  if (intensity <= 7) {
    return 2;
  }

  return 3;
}

export function NewRecordIntensityStep({
  emotion,
  quadrant,
  intensity,
  onChange,
  onContinue,
}: NewRecordIntensityStepProps) {
  const styles = getMoodStyles(quadrant);

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <NewRecordStepTitle
        before="¿Con qué intensidad sientes"
        emphasis={emotion}
        after="?"
        emphasisClassName={styles.strong}
      />

      <div className="flex flex-1 items-center justify-center py-6">
        <motion.div
          animate={{ scale: 0.55 + intensity * 0.045 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className={cn(
            "relative flex size-64 items-center justify-center rounded-full shadow-2xl transition-colors duration-300",
            styles.tones[getTone(intensity)],
          )}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-radial-[at_30%_25%] from-white/55 via-transparent to-transparent"
            aria-hidden="true"
          />
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-white/40"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3.2 - intensity * 0.2, repeat: Infinity }}
            aria-hidden="true"
          />
          <span className="relative text-center text-mood-foreground">
            <span className="block font-display text-7xl font-medium">
              {intensity}
            </span>
            <span className="text-sm font-semibold">
              {INTENSITY_LABELS[intensity - 1]}
            </span>
          </span>
        </motion.div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Slider
            min={1}
            max={10}
            step={1}
            value={[intensity]}
            aria-label="Intensidad"
            onValueChange={(value) => {
              const next = Array.isArray(value) ? value[0] : value;
              onChange(next ?? intensity);
            }}
            className="[&_[data-slot=slider-range]]:bg-foreground [&_[data-slot=slider-thumb]]:size-7 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:shadow-md [&_[data-slot=slider-track]]:h-2"
          />
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Apenas</span>
            <span>Muchísimo</span>
          </div>
        </div>
        <div className="flex justify-end">
          <NewRecordNextButton onClick={onContinue} />
        </div>
      </div>
    </div>
  );
}
