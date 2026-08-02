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
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              id={id}
              variant="outline"
              disabled={disabled}
              className="h-11 w-full justify-start gap-2 px-3 font-normal"
            />
          }
        >
          <CalendarIcon className="size-4 text-muted-foreground" />
          {formatOccurrenceDate(value)}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
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
