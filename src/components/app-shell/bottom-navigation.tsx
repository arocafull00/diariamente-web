"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { NavIcon } from "./nav-icon";
import { patientItems, psychologistItems, type NavItem } from "./nav-items";

const HIDDEN_ROUTES = new Set(["/nuevo-registro"]);

function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  if (HIDDEN_ROUTES.has(pathname)) {
    return null;
  }

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] lg:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-lg items-stretch justify-around rounded-full border border-border bg-background/90 px-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/75">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-2 text-xs font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <motion.span
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="relative flex h-8 w-14 items-center justify-center"
              >
                {active ? (
                  <motion.span
                    layoutId="bottom-nav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-accent"
                  />
                ) : null}
                <motion.span
                  animate={{ scale: active ? 1.1 : 1, y: active ? -1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="relative"
                >
                  <NavIcon name={item.icon} className="size-5" />
                </motion.span>
              </motion.span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function PatientNavigation() {
  return <BottomNav items={patientItems} />;
}

export function PsychologistNavigation() {
  return <BottomNav items={psychologistItems} />;
}
