"use client";

import { motion } from "motion/react";

import type { MoodQuadrant } from "@/db/schema";
import { MOOD_STYLES } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type QuadrantBlobProps = {
  quadrant: MoodQuadrant;
  energy: string;
  pleasantness: string;
  index: number;
  onSelect: (quadrant: MoodQuadrant) => void;
};

export function QuadrantBlob({
  quadrant,
  energy,
  pleasantness,
  index,
  onSelect,
}: QuadrantBlobProps) {
  const styles = MOOD_STYLES[quadrant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18, delay: index * 0.07 }}
    >
      <motion.button
        type="button"
        onClick={() => onSelect(quadrant)}
        animate={{ y: [0, -6, 0], rotate: [0, index % 2 ? -2 : 2, 0] }}
        transition={{
          duration: 4 + index * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-full p-4 text-center text-mood-foreground shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-ring/50",
          styles.tones[3],
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute inset-[12%] rounded-full blur-xl",
            styles.tones[1],
          )}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-radial-[at_30%_25%] from-white/60 via-transparent to-transparent"
          aria-hidden="true"
        />
        <span className="relative font-display text-base leading-tight font-medium sm:text-lg">
          {energy}
          <br />
          {pleasantness}
        </span>
      </motion.button>
    </motion.div>
  );
}
