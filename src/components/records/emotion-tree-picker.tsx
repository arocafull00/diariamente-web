"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";

import { EmotionTreeCluster } from "@/components/records/emotion-tree-cluster";
import { EmotionTreeNode } from "@/components/records/emotion-tree-node";
import { useElementSize } from "@/components/records/use-element-size";
import type { GrammaticalGender, MoodQuadrant } from "@/db/schema";
import { findTreeBranch, type EmotionTreeRoot } from "@/lib/emotion-tree";
import {
  getEmotionTreeLayout,
  type EmotionTreeLayoutNode,
} from "@/lib/emotion-tree-layout";
import { MOOD_STYLES } from "@/lib/emotions";
import { cn } from "@/lib/utils";

const STAGE_SIZE = 720;
const STAGE_PADDING = 12;

type EmotionTreePickerProps = {
  root: EmotionTreeRoot;
  emotion: string | null;
  gender: GrammaticalGender;
  onSelect: (name: string, quadrant: MoodQuadrant, group: string) => void;
  onQuickSave: (name: string, quadrant: MoodQuadrant, group: string) => void;
  onContinue: () => void;
};

export function EmotionTreePicker({
  root,
  emotion,
  gender,
  onSelect,
  onQuickSave,
  onContinue,
}: EmotionTreePickerProps) {
  const [openBranch, setOpenBranch] = useState(() => findTreeBranch(root, emotion));
  const { ref, size } = useElementSize<HTMLDivElement>();
  const filterId = `tree-goo-${useId().replace(/[^\w-]/g, "")}`;
  const { nodes, positions, bounds } = getEmotionTreeLayout(root, openBranch, emotion, gender);
  const stageScale = size.width
    ? Math.min(
        1,
        size.width / (bounds.width + STAGE_PADDING),
        size.height / (bounds.height + STAGE_PADDING),
      )
    : 1;

  function handleSelect(node: EmotionTreeLayoutNode) {
    if (node.selected) {
      onContinue();
      return;
    }

    if (node.kind !== "child") {
      setOpenBranch(node.name);
    }

    onSelect(node.name, node.quadrant, root.id);
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center px-2 pt-22 pb-36">
      <h3
        className={cn(
          "font-display text-2xl font-medium",
          MOOD_STYLES[root.palette].strong,
        )}
      >
        {root.label}
      </h3>
      <div ref={ref} className="relative w-full flex-1">
        <svg className="absolute size-0" aria-hidden="true">
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </svg>
        <motion.div
          initial={false}
          animate={{
            scale: stageScale,
            x: -bounds.centerX * stageScale,
            y: -bounds.centerY * stageScale,
          }}
          transition={{ type: "spring", stiffness: 170, damping: 22 }}
          className="absolute top-1/2 left-1/2"
          style={{
            width: STAGE_SIZE,
            height: STAGE_SIZE,
            marginLeft: -STAGE_SIZE / 2,
            marginTop: -STAGE_SIZE / 2,
          }}
        >
          {root.branches.map((branch) => (
            <EmotionTreeCluster
              key={branch.name}
              nodes={nodes.filter((node) => node.cluster === branch.name)}
              positions={positions}
              filterId={filterId}
            />
          ))}
          <div className="absolute inset-0">
            <AnimatePresence custom={positions}>
              {nodes.map((node) => (
                <EmotionTreeNode
                  key={node.key}
                  node={node}
                  positions={positions}
                  onSelect={handleSelect}
                  onQuickSave={(item) => onQuickSave(item.name, item.quadrant, root.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
