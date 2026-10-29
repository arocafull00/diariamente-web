"use client";

import { motion } from "motion/react";
import Link from "next/link";

const MotionLink = motion.create(Link);

type PressableLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
} & Partial<Record<`data-${string}`, string>>;

export function PressableLink({
  href,
  className,
  children,
  ...dataAttributes
}: PressableLinkProps) {
  return (
    <MotionLink
      href={href}
      className={className}
      data-cuelume-tap="type"
      {...dataAttributes}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </MotionLink>
  );
}
