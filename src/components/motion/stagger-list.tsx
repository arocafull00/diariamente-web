"use client";

import { motion, type Variants } from "motion/react";

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

type StaggerListProps = {
  children: React.ReactNode;
  className?: string;
};

export function StaggerList({ children, className }: StaggerListProps) {
  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}
