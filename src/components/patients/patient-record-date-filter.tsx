"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarRange } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { getRecordFilterTriggerClassName } from "@/components/patients/patient-record-filter-trigger-styles";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatRecordFilterRange,
  RECORD_DATE_KEY_FORMAT,
} from "@/lib/record-filters";
import { isFutureDay } from "@/lib/utils-app";

type PatientRecordDateFilterProps = {
  from?: string;
  to?: string;
  onApply: (range: { from?: string; to?: string }) => void;
};

function getDateRange(from?: string, to?: string): DateRange | undefined {
  if (!from && !to) {
    return undefined;
  }

  return {
    from: from ? parseISO(from) : undefined,
    to: to ? parseISO(to) : undefined,
  };
}

export function PatientRecordDateFilter({
  from,
  to,
  onApply,
}: PatientRecordDateFilterProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(() =>
    getDateRange(from, to),
  );
  const rangeLabel = formatRecordFilterRange(from, to);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(getDateRange(from, to));
    }

    setOpen(next);
  };

  const apply = (range: DateRange | undefined) => {
    const start = range?.from ?? range?.to;
    const end = range?.to ?? range?.from;

    onApply({
      from: start ? format(start, RECORD_DATE_KEY_FORMAT) : undefined,
      to: end ? format(end, RECORD_DATE_KEY_FORMAT) : undefined,
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className={getRecordFilterTriggerClassName(Boolean(rangeLabel))}
      >
        <CalendarRange className="size-4 shrink-0" aria-hidden="true" />
        {rangeLabel ?? "Fechas"}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto gap-3 rounded-3xl p-3">
        <p className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Elige un día o un periodo
        </p>
        <Calendar
          mode="range"
          selected={draft}
          onSelect={setDraft}
          defaultMonth={draft?.from}
          disabled={isFutureDay}
          locale={es}
          autoFocus
        />
        <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => apply(undefined)}
          >
            Limpiar
          </Button>
          <Button size="sm" disabled={!draft?.from} onClick={() => apply(draft)}>
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
