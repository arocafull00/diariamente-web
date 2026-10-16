"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { EmotionSearchResult } from "@/components/records/emotion-search-result";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { EmotionOption } from "@/lib/emotions";

type EmotionSearchSheetProps = {
  options: EmotionOption[];
  onSelect: (option: EmotionOption) => void;
};

const MAX_RESULTS = 30;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function EmotionSearchSheet({
  options,
  onSelect,
}: EmotionSearchSheetProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const normalizedQuery = normalize(query);
  const results = normalizedQuery
    ? options.filter((option) => normalize(option.name).includes(normalizedQuery))
    : options;

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (!next) {
      setQuery("");
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        aria-label="Buscar emoción"
        className="flex size-11 items-center justify-center rounded-full bg-card/90 shadow-md backdrop-blur outline-none transition-transform active:scale-90 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Search className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-h-[85svh] max-w-lg rounded-t-3xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <SheetTitle className="px-1 font-display text-xl font-medium">
          Buscar emoción
        </SheetTitle>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Escribe cómo te sientes"
            className="h-12 rounded-2xl pl-9"
            autoFocus
          />
        </div>
        <ul className="-mx-1 flex-1 overflow-y-auto">
          {results.slice(0, MAX_RESULTS).map((option) => (
            <EmotionSearchResult
              key={option.name}
              name={option.name}
              definition={option.definition}
              quadrant={option.quadrant}
              onSelect={() => {
                onSelect(option);
                handleOpenChange(false);
              }}
            />
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
