"use client";

import { LoaderCircle } from "lucide-react";
import { motion } from "motion/react";

import { MoodSummaryCard } from "@/components/records/mood-summary-card";
import { NewRecordStepTitle } from "@/components/records/new-record-step-title";
import { RecordDatePicker } from "@/components/records/record-date-picker";
import { RecordTimeInput } from "@/components/records/record-time-input";
import type { MoodQuadrant } from "@/db/schema";

type NewRecordWhenStepProps = {
  emotion: string;
  quadrant: MoodQuadrant | null;
  tags: string[];
  note: string;
  occurredAt: Date;
  pending: boolean;
  onChange: (date: Date) => void;
  onSave: () => void;
};

export function NewRecordWhenStep({
  emotion,
  quadrant,
  tags,
  note,
  occurredAt,
  pending,
  onChange,
  onSave,
}: NewRecordWhenStepProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-lg flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="flex-1 space-y-6 overflow-y-auto pb-4">
        <NewRecordStepTitle before="¿Cuándo ocurrió?" />
        <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] gap-3 rounded-3xl bg-card p-4 shadow-sm ring-1 ring-border/60">
          <RecordDatePicker value={occurredAt} onChange={onChange} />
          <RecordTimeInput value={occurredAt} onChange={onChange} />
        </div>
        <MoodSummaryCard
          prefix="Me siento"
          emotion={emotion}
          quadrant={quadrant}
          tags={tags}
          note={note}
          occurredAt={occurredAt}
        />
      </div>
      <motion.button
        type="button"
        onClick={onSave}
        disabled={pending}
        whileTap={{ scale: 0.97 }}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground text-base font-semibold text-background shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-ring/50 disabled:opacity-60"
      >
        {pending ? (
          <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
        ) : null}
        {pending ? "Guardando..." : "Guardar"}
      </motion.button>
    </div>
  );
}
