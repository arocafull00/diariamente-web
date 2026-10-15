"use client";

import { Hand } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { NewRecordNextButton } from "@/components/records/new-record-next-button";
import type { MoodStyles } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type EmotionSelectionBarProps = {
  emotion: string | null;
  definition: string;
  styles: MoodStyles;
  onContinue: () => void;
};

export function EmotionSelectionBar({
  emotion,
  definition,
  styles,
  onContinue,
}: EmotionSelectionBarProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto mx-auto flex max-w-lg items-center gap-3 rounded-full bg-card/95 p-2 pl-6 shadow-xl ring-1 ring-border/60 backdrop-blur">
        <div className="min-h-14 min-w-0 flex-1 py-1">
          <AnimatePresence mode="popLayout" initial={false}>
            {emotion ? (
              <motion.div
                key={emotion}
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                transition={{ duration: 0.16 }}
              >
                <p className={cn("font-display text-lg leading-tight font-semibold", styles.strong)}>
                  {emotion}
                </p>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {definition}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full items-center gap-2 py-2 text-sm leading-snug text-muted-foreground"
              >
                <Hand className="size-4 shrink-0" aria-hidden="true" />
                Toca una emoción. Mantén pulsado para guardar rápido.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <NewRecordNextButton onClick={onContinue} disabled={!emotion} />
      </div>
    </div>
  );
}
