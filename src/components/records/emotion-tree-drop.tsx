"use client";

import { motion } from "motion/react";

import { CIRCLE_CLIP_PATH, getEmotionShape } from "@/lib/emotion-shapes";
import {
  getTreeNodeMotion,
  type EmotionTreeLayoutNode,
  type EmotionTreePositions,
} from "@/lib/emotion-tree-layout";
import { MOOD_STYLES } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type EmotionTreeDropProps = {
  node: EmotionTreeLayoutNode;
  positions: EmotionTreePositions;
};

export function EmotionTreeDrop({ node, positions }: EmotionTreeDropProps) {
  const shape = getEmotionShape(node.name);
  const { variants, style } = getTreeNodeMotion(node);
  const shapeSpring = {
    type: "spring",
    stiffness: shape.stiffness,
    damping: shape.damping,
  } as const;

  return (
    <motion.div
      custom={positions}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={style}
      className="absolute top-1/2 left-1/2"
    >
      <motion.div
        initial={false}
        animate={{
          clipPath: node.selected ? shape.clipPath : CIRCLE_CLIP_PATH,
          rotate: node.selected ? shape.rotate : 0,
          scale: node.selected ? [shape.scale, shape.scale * 1.05, shape.scale] : 1,
        }}
        transition={{
          clipPath: shapeSpring,
          rotate: shapeSpring,
          scale: node.selected
            ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            : shapeSpring,
        }}
        className={cn(
          "size-full rounded-full transition-colors duration-300",
          MOOD_STYLES[node.palette].tones[node.tone],
        )}
      />
    </motion.div>
  );
}
