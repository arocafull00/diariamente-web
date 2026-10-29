"use client";

import type { BodySide } from "@/db/schema";
import { BODY_SIDE_LABELS } from "@/lib/body-sensations";
import { cn } from "@/lib/utils";

type BodySideToggleOptionProps = {
  side: BodySide;
  selected: boolean;
  onSelect: (side: BodySide) => void;
};

export function BodySideToggleOption({ side, selected, onSelect }: BodySideToggleOptionProps) {
  return (
    <button
      type="button"
      data-cuelume-select=""
      onClick={() => onSelect(side)}
      aria-pressed={selected}
      className={cn(
        "h-9 rounded-full px-4 text-sm font-semibold outline-none transition-[color,background-color,transform] active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50",
        selected ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {BODY_SIDE_LABELS[side]}
    </button>
  );
}
