"use client";

import { motion } from "motion/react";

import { useLongPress } from "@/components/records/use-long-press";
import {
  getTreeNodeMotion,
  type EmotionTreeLayoutNode,
  type EmotionTreePositions,
} from "@/lib/emotion-tree-layout";
import { cn } from "@/lib/utils";

type EmotionTreeNodeProps = {
  node: EmotionTreeLayoutNode;
  positions: EmotionTreePositions;
  onSelect: (node: EmotionTreeLayoutNode) => void;
  onQuickSave: (node: EmotionTreeLayoutNode) => void;
};

export function EmotionTreeNode({
  node,
  positions,
  onSelect,
  onQuickSave,
}: EmotionTreeNodeProps) {
  const { variants, style } = getTreeNodeMotion(node);
  const { handlers, consumeTrigger } = useLongPress(() => onQuickSave(node));

  return (
    <motion.button
      type="button"
      {...handlers}
      onClick={() => {
        if (consumeTrigger()) {
          return;
        }

        onSelect(node);
      }}
      aria-pressed={node.selected}
      custom={positions}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileTap={{ scale: 0.9 }}
      style={style}
      className="absolute top-1/2 left-1/2 flex items-center justify-center rounded-full p-3 text-center font-display leading-tight font-medium text-mood-foreground outline-none select-none [-webkit-touch-callout:none] focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span
        className={cn(
          node.kind === "child" ? "text-base" : "text-lg",
          node.selected && "font-semibold",
        )}
      >
        {node.label}
      </span>
    </motion.button>
  );
}
