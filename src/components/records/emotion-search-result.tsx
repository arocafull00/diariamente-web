"use client";

import { MoodBubble } from "@/components/records/mood-bubble";
import type { MoodQuadrant } from "@/db/schema";

type EmotionSearchResultProps = {
  name: string;
  definition: string;
  quadrant: MoodQuadrant | null;
  onSelect: () => void;
};

export function EmotionSearchResult({
  name,
  definition,
  quadrant,
  onSelect,
}: EmotionSearchResultProps) {
  return (
    <li>
      <button
        type="button"
        data-cuelume-select="ready"
        data-cuelume-theme="bubble"
        onClick={onSelect}
        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left outline-none transition-colors hover:bg-secondary focus-visible:bg-secondary"
      >
        <MoodBubble quadrant={quadrant} className="size-9" />
        <span className="min-w-0">
          <span className="block font-semibold">{name}</span>
          <span className="block truncate text-sm text-muted-foreground">
            {definition}
          </span>
        </span>
      </button>
    </li>
  );
}
