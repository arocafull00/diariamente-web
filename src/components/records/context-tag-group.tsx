"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { ContextTagChip } from "@/components/records/context-tag-chip";
import type { MoodStyles } from "@/lib/emotions";

type ContextTagGroupProps = {
  label: string;
  options: string[];
  selected: string[];
  styles: MoodStyles;
  onToggle: (tag: string) => void;
};

export function ContextTagGroup({
  label,
  options,
  selected,
  styles,
  onToggle,
}: ContextTagGroupProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const allOptions = Array.from(new Set([...options, ...selected]));

  function commitDraft() {
    const tag = draft.trim().slice(0, 40);
    setDraft("");
    setAdding(false);

    if (!tag || selected.includes(tag)) {
      return;
    }

    onToggle(tag);
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {allOptions.map((option) => (
          <ContextTagChip
            key={option}
            label={option}
            selected={selected.includes(option)}
            styles={styles}
            onToggle={() => onToggle(option)}
          />
        ))}
        {adding ? (
          <input
            autoFocus
            value={draft}
            maxLength={40}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitDraft}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitDraft();
              }

              if (event.key === "Escape") {
                setDraft("");
                setAdding(false);
              }
            }}
            placeholder="Escribe y pulsa intro"
            aria-label={`Añadir a ${label.toLowerCase()}`}
            className="min-h-11 w-48 rounded-full bg-card px-4 text-sm ring-2 ring-ring/40 outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            aria-label={`Añadir a ${label.toLowerCase()}`}
            className="flex size-11 items-center justify-center rounded-full bg-card ring-1 ring-border outline-none transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}
