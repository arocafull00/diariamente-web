"use client";

import { AnimatePresence, motion } from "motion/react";

import { BodySensationDetails } from "@/components/records/body-sensation-details";
import { SensationPad } from "@/components/records/sensation-pad";
import type { BodyRegionId, SensationValue } from "@/lib/body-sensations";

type BodySensationEditorProps = {
  region: BodyRegionId;
  value: SensationValue | null;
  tags: string[];
  editingValue: boolean;
  onChange: (value: SensationValue) => void;
  onCommit: (value: SensationValue) => void;
  onToggleTag: (tag: string) => void;
  onEditValue: () => void;
  onContinue: () => void;
};

const panelMotion = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 24 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;

export function BodySensationEditor({
  region,
  value,
  tags,
  editingValue,
  onChange,
  onCommit,
  onToggleTag,
  onEditValue,
  onContinue,
}: BodySensationEditorProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {editingValue || !value ? (
        <motion.div key="pad" {...panelMotion} className="flex justify-center">
          <SensationPad value={value} onChange={onChange} onCommit={onCommit} />
        </motion.div>
      ) : (
        <motion.div key="details" {...panelMotion} className="mx-auto max-w-lg">
          <BodySensationDetails
            region={region}
            value={value}
            tags={tags}
            onToggleTag={onToggleTag}
            onEditValue={onEditValue}
            onContinue={onContinue}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
