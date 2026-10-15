"use client";

import { motion, type HTMLMotionProps } from "motion/react";

export function TapButton(props: HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      {...props}
    />
  );
}
