"use client";

import { ArrowRight, House } from "lucide-react";
import { motion } from "motion/react";

import { MoodBubble } from "@/components/records/mood-bubble";
import { MoodSummaryCard } from "@/components/records/mood-summary-card";
import type { MoodQuadrant } from "@/db/schema";

type NewRecordSuccessProps = {
  emotion: string;
  quadrant: MoodQuadrant;
  tags: string[];
  note: string;
  occurredAt: Date;
  needsDeepen: boolean;
  onOpenRecord: () => void;
  onGoHome: () => void;
};

const CELEBRATION_BUBBLES = [
  { x: -120, y: -160, size: "size-10", delay: 0.05 },
  { x: 130, y: -140, size: "size-14", delay: 0.12 },
  { x: -140, y: 60, size: "size-8", delay: 0.2 },
  { x: 140, y: 90, size: "size-12", delay: 0.08 },
  { x: 0, y: -210, size: "size-6", delay: 0.16 },
];

export function NewRecordSuccess({
  emotion,
  quadrant,
  tags,
  note,
  occurredAt,
  needsDeepen,
  onOpenRecord,
  onGoHome,
}: NewRecordSuccessProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center gap-8 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="relative">
        {CELEBRATION_BUBBLES.map((bubble, index) => (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2"
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{ x: bubble.x, y: bubble.y, scale: 1, opacity: [0, 1, 0.8] }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              delay: bubble.delay,
              opacity: { type: "tween", duration: 0.6, delay: bubble.delay },
            }}
          >
            <MoodBubble quadrant={quadrant} tone={index % 2 ? 1 : 3} className={bubble.size} />
          </motion.div>
        ))}
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -6 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          <MoodSummaryCard
            prefix="Me siento"
            emotion={emotion}
            quadrant={quadrant}
            tags={tags}
            note={note}
            occurredAt={occurredAt}
            className="min-h-64 shadow-xl"
          />
        </motion.div>
      </div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <p className="text-center text-sm text-muted-foreground">
          {needsDeepen
            ? "Registro guardado. Puedes profundizar cuando quieras."
            : "Registro guardado."}
        </p>
        <button
          type="button"
          onClick={onOpenRecord}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground text-base font-semibold text-background shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
        >
          {needsDeepen ? "Profundizar" : "Ver registro"}
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onGoHome}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-card text-base font-semibold shadow-sm ring-1 ring-border outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
        >
          <House className="size-5" aria-hidden="true" />
          Volver al inicio
        </button>
      </motion.div>
    </div>
  );
}
