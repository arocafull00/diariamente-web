"use client";

import { motion } from "motion/react";
import Link from "next/link";

const MotionLink = motion.create(Link);

type PressableLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function PressableLink({ href, className, children }: PressableLinkProps) {
  return (
    <MotionLink
      href={href}
      className={className}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </MotionLink>
  );
}
