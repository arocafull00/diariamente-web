"use client";

import { AnimatePresence } from "motion/react";

import { EmotionTreeDrop } from "@/components/records/emotion-tree-drop";
import type {
  EmotionTreeLayoutNode,
  EmotionTreePositions,
} from "@/lib/emotion-tree-layout";

type EmotionTreeClusterProps = {
  nodes: EmotionTreeLayoutNode[];
  positions: EmotionTreePositions;
  filterId: string;
};

export function EmotionTreeCluster({
  nodes,
  positions,
  filterId,
}: EmotionTreeClusterProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ filter: `url(#${filterId})` }}
      aria-hidden="true"
    >
      <AnimatePresence custom={positions}>
        {nodes.map((node) => (
          <EmotionTreeDrop key={node.key} node={node} positions={positions} />
        ))}
      </AnimatePresence>
    </div>
  );
}
