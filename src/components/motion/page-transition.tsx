"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

const FULLSCREEN_ROUTES = new Set(["/nuevo-registro"]);

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  if (FULLSCREEN_ROUTES.has(pathname)) {
    return <div className="flex w-full flex-1 flex-col">{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.8 }}
      className="flex w-full flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
