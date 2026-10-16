"use client";

import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";

type BodySensationsOverviewFooterProps = {
  hasSensations: boolean;
  onDone: () => void;
};

export function BodySensationsOverviewFooter({
  hasSensations,
  onDone,
}: BodySensationsOverviewFooterProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {hasSensations ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-lg"
        >
          <Button size="lg" className="w-full" onClick={onDone}>
            Listo
          </Button>
        </motion.div>
      ) : (
        <motion.p
          key="hint"
          exit={{ opacity: 0 }}
          className="mx-auto max-w-xs py-3 text-center text-sm text-balance text-muted-foreground"
        >
          Toca la zona donde lo notas. Puede ser tensión, calor, opresión, hormigueo o algo
          completamente distinto.
        </motion.p>
      )}
    </AnimatePresence>
  );
}
