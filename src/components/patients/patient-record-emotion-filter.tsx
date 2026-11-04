"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { PatientRecordEmotionOption } from "@/components/patients/patient-record-emotion-option";
import { getRecordFilterTriggerClassName } from "@/components/patients/patient-record-filter-trigger-styles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { GrammaticalGender } from "@/db/schema";
import {
  getEmotionLabel,
  getEmotionQuadrant,
  getMoodStyles,
} from "@/lib/emotions";
import type { RecordEmotionOption } from "@/lib/record-filters";

type PatientRecordEmotionFilterProps = {
  options: RecordEmotionOption[];
  selected: string[];
  gender: GrammaticalGender;
  onApply: (emotions: string[]) => void;
};

export function PatientRecordEmotionFilter({
  options,
  selected,
  gender,
  onApply,
}: PatientRecordEmotionFilterProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(selected);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(selected);
    }

    setOpen(next);
  };

  const toggle = (emotion: string) => {
    setDraft((current) =>
      current.includes(emotion)
        ? current.filter((item) => item !== emotion)
        : [...current, emotion],
    );
  };

  const apply = (emotions: string[]) => {
    onApply(emotions);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        disabled={options.length === 0}
        className={getRecordFilterTriggerClassName(selected.length > 0)}
      >
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        Emociones
        {selected.length > 0 ? <Badge>{selected.length}</Badge> : null}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 gap-3 rounded-3xl p-3">
        <p className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Emociones registradas
        </p>
        <ul className="-mx-1 max-h-72 space-y-1 overflow-y-auto px-1">
          {options.map((option) => (
            <PatientRecordEmotionOption
              key={option.emotion}
              label={getEmotionLabel(option.emotion, gender)}
              count={option.count}
              styles={getMoodStyles(getEmotionQuadrant(option.emotion))}
              selected={draft.includes(option.emotion)}
              onToggle={() => toggle(option.emotion)}
            />
          ))}
        </ul>
        <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => apply([])}
          >
            Limpiar
          </Button>
          <Button size="sm" onClick={() => apply(draft)}>
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
