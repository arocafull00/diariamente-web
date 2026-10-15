"use client";

import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatOccurrenceDate,
  isFutureDay,
  mergeOccurrenceDate,
} from "@/lib/utils-app";
import { cn } from "@/lib/utils";

type RecordDatePickerProps = {
  id?: string;
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
  className?: string;
};

export function RecordDatePicker({
  id = "date",
  label = "Fecha",
  value,
  onChange,
  disabled,
  className,
}: RecordDatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("min-w-0 space-y-2", className)}>
      <Label
        htmlFor={id}
        className="px-1 text-xs font-semibold text-muted-foreground"
      >
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              id={id}
              variant="ghost"
              disabled={disabled}
              className="h-12 w-full justify-start gap-2 rounded-2xl bg-secondary px-3.5 text-sm font-semibold text-foreground hover:bg-secondary/70 focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-secondary/70"
            />
          }
        >
          <CalendarIcon className="size-4 shrink-0 text-primary" />
          <span className="truncate">{formatOccurrenceDate(value)}</span>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-3xl p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (!date) {
                return;
              }

              onChange(mergeOccurrenceDate(value, date));
              setOpen(false);
            }}
            disabled={isFutureDay}
            locale={es}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
