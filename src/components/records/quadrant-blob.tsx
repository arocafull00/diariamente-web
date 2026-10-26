"use client";

import { motion } from "motion/react";

import type { MoodQuadrant } from "@/db/schema";
import { MOOD_STYLES } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type QuadrantBlobProps = {
  quadrant: MoodQuadrant;
  label: string;
  index: number;
  onSelect: () => void;
};

export function QuadrantBlob({
  quadrant,
  label,
  index,
  onSelect,
}: QuadrantBlobProps) {
  const styles = MOOD_STYLES[quadrant];
  const direction = index % 2 ? "reverse" : "normal";
  const ghostClassName = cn(
    "pointer-events-none absolute inset-0 animate-mood-ghost rounded-full mix-blend-multiply",
    styles.ghost,
  );

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18, delay: index * 0.07 }}
    >
      <div
        className="relative animate-mood-float"
        style={{ animationDuration: `${6.5 + index * 0.8}s`, animationDelay: `${-index * 1.7}s` }}
      >
        <span
          className={ghostClassName}
          style={{
            animationDuration: `${6 + index * 0.7}s, ${4.5 + index * 0.6}s`,
            animationDelay: `${-index * 1.3}s`,
            animationDirection: direction,
          }}
          aria-hidden="true"
        />
        <span
          className={cn(ghostClassName, "[--orbit-radius:5%] [--orbit-scale:1.02]")}
          style={{
            animationDuration: `${8.5 + index * 0.5}s, ${5.5 + index * 0.4}s`,
            animationDelay: `${-index * 2.1 - 3}s`,
            animationDirection: direction === "normal" ? "reverse" : "normal",
          }}
          aria-hidden="true"
        />
        <motion.button
          type="button"
          onClick={onSelect}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          style={{ animationDuration: `${4 + index * 0.5}s`, animationDelay: `${-index * 1.1}s` }}
          className={cn(
            "relative flex aspect-square w-full animate-mood-wobble items-center justify-center overflow-hidden rounded-full p-4 text-center text-mood-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/50",
            styles.tones[3],
          )}
        >
          <span className="relative font-display text-base leading-tight font-medium whitespace-pre-line sm:text-lg">
            {label}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
