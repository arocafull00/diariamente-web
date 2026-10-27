"use client";

import { motion } from "motion/react";

import { Face } from "@/components/faces/face";
import type { FaceId } from "@/lib/faces";
import { cn } from "@/lib/utils";

type WelcomeMascotProps = {
  faceId: FaceId;
  title: string;
  description: string;
  hero: boolean;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
};

export function WelcomeMascot({
  faceId,
  title,
  description,
  hero,
  titleRef,
}: WelcomeMascotProps) {
  return (
    <div
      className={cn(
        "flex gap-4",
        hero ? "flex-col items-center text-center" : "items-end",
      )}
    >
      <motion.div
        key={faceId}
        initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
        className="shrink-0"
      >
        <Face
          faceId={faceId}
          size={hero ? 256 : 160}
          priority
          className={cn(
            "h-auto drop-shadow-md motion-safe:animate-mood-float",
            hero ? "w-48 sm:w-60" : "w-28 sm:w-32",
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.12 }}
        className={cn(
          "relative min-w-0 rounded-3xl border-2 border-border bg-card px-5 py-4 shadow-xs",
          hero ? "w-full" : "mb-3 flex-1",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute size-4 rotate-45 border-border bg-card",
            hero
              ? "-top-[9px] left-1/2 -translate-x-1/2 border-l-2 border-t-2"
              : "-left-[9px] bottom-6 border-b-2 border-l-2",
          )}
        />
        <h1
          ref={titleRef}
          tabIndex={-1}
          className="text-balance text-xl font-bold tracking-tight outline-none sm:text-2xl"
        >
          {title}
        </h1>
        <p className="mt-1.5 text-pretty text-base leading-6 text-foreground/70">
          {description}
        </p>
      </motion.div>
    </div>
  );
}
