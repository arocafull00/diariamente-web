"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { NavIcon } from "./nav-icon";
import type { NavItem } from "./nav-items";

export function SidebarNavItem({ href, label, icon }: NavItem) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
        active
          ? "text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {active ? (
        <motion.span
          layoutId="sidebar-nav-indicator"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="absolute inset-0 rounded-xl bg-accent"
        />
      ) : null}
      <motion.span
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative flex items-center gap-3"
      >
        <NavIcon name={icon} className="size-5" />
        {label}
      </motion.span>
    </Link>
  );
}
