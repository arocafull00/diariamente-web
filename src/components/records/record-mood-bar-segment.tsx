"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type RecordMoodBarSegmentProps = {
  percent: number;
  index: number;
  className: string;
};

export function RecordMoodBarSegment({
  percent,
  index,
  className,
}: RecordMoodBarSegmentProps) {
  return (
    <motion.span
      initial={{ width: 0 }}
      animate={{ width: `${percent}%` }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.15 + index * 0.08 }}
      className={cn("h-full rounded-full", className)}
    />
  );
}
