"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

const FAB_ROUTES = new Set(["/mis-registros"]);

export function NewRecordFab() {
  const pathname = usePathname();

  if (!FAB_ROUTES.has(pathname)) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto flex max-w-lg justify-end px-4">
        <MotionLink
          href="/nuevo-registro"
          initial={{ opacity: 0, scale: 0.6, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 420, damping: 24, delay: 0.1 }}
          className={cn(buttonVariants({ size: "lg" }), "pointer-events-auto")}
        >
          <motion.span
            initial={{ rotate: -90 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
            className="flex"
          >
            <Plus className="size-5 shrink-0" strokeWidth={2.5} />
          </motion.span>
          <span>Nuevo registro</span>
        </MotionLink>
      </div>
    </div>
  );
}
