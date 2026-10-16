"use client";

import { motion } from "motion/react";

import { SensationPadDots } from "@/components/records/sensation-pad-dots";
import { SensationPadLabel } from "@/components/records/sensation-pad-label";
import { useSensationPad } from "@/components/records/use-sensation-pad";
import {
  SENSATION_MIDPOINT,
  getSensationLabel,
  getSensationQuadrant,
  type SensationValue,
} from "@/lib/body-sensations";
import { getMoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type SensationPadProps = {
  value: SensationValue | null;
  onChange: (value: SensationValue) => void;
  onCommit: (value: SensationValue) => void;
};

export function SensationPad({ value, onChange, onCommit }: SensationPadProps) {
  const { areaRef, handlers } = useSensationPad({ value, onChange, onCommit });
  const styles = getMoodStyles(value ? getSensationQuadrant(value) : null);
  const high = value !== null && value.intensity >= SENSATION_MIDPOINT;
  const low = value !== null && value.intensity < SENSATION_MIDPOINT;
  const pleasant = value !== null && value.pleasantness >= SENSATION_MIDPOINT;
  const unpleasant = value !== null && value.pleasantness < SENSATION_MIDPOINT;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto] items-center justify-items-center gap-2">
      <span className="col-start-2">
        <SensationPadLabel label="Alta intensidad" active={high} activeClassName={styles.strong} />
      </span>
      <span className="row-start-2">
        <SensationPadLabel
          label="Desagradable"
          active={unpleasant}
          activeClassName={styles.strong}
          orientation="vertical-up"
        />
      </span>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Cómo de agradable e intensa es la sensación"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value?.pleasantness ?? SENSATION_MIDPOINT}
        aria-valuetext={value ? getSensationLabel(value) : "Sin seleccionar"}
        {...handlers}
        className="relative row-start-2 size-56 touch-none rounded-[2.5rem] bg-card p-3 shadow-sm ring-1 ring-border outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:size-64"
      >
        <div ref={areaRef} className="relative size-full">
          <SensationPadDots value={value} />
          {value ? (
            <motion.span
              initial={false}
              animate={{ left: `${value.pleasantness}%`, top: `${100 - value.intensity}%` }}
              transition={{ type: "spring", stiffness: 600, damping: 40 }}
              className={cn(
                "pointer-events-none absolute size-5 -translate-1/2 rounded-full bg-card shadow-md ring-4",
                styles.ring,
              )}
            />
          ) : null}
        </div>
      </div>
      <span className="row-start-2">
        <SensationPadLabel
          label="Agradable"
          active={pleasant}
          activeClassName={styles.strong}
          orientation="vertical-down"
        />
      </span>
      <span className="col-start-2 row-start-3">
        <SensationPadLabel label="Baja intensidad" active={low} activeClassName={styles.strong} />
      </span>
    </div>
  );
}
