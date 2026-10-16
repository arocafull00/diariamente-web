"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { ContextTagChip } from "@/components/records/context-tag-chip";
import type { MoodStyles } from "@/lib/emotions";

type SensationTagPickerProps = {
  options: string[];
  selected: string[];
  styles: MoodStyles;
  onToggle: (tag: string) => void;
};

export function SensationTagPicker({
  options,
  selected,
  styles,
  onToggle,
}: SensationTagPickerProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const allOptions = Array.from(new Set([...selected, ...options]));

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
    <div className="-mx-6 flex gap-2 overflow-x-auto px-6 py-1 [scrollbar-width:none]">
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
          aria-label="Nueva etiqueta"
          className="min-h-11 w-48 shrink-0 rounded-full bg-card px-4 text-sm ring-2 ring-ring/40 outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-card px-4 text-sm font-semibold ring-1 ring-border outline-none transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Plus className="size-4" aria-hidden="true" />
          Agregar etiqueta
        </button>
      )}
      {allOptions.map((option) => (
        <span key={option} className="shrink-0">
          <ContextTagChip
            label={option}
            selected={selected.includes(option)}
            styles={styles}
            onToggle={() => onToggle(option)}
          />
        </span>
      ))}
    </div>
  );
}
