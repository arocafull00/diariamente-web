"use client";

import { Clock } from "lucide-react";

import { Label } from "@/components/ui/label";
import { formatOccurrenceTime, mergeOccurrenceTime } from "@/lib/utils-app";
import { cn } from "@/lib/utils";

type RecordTimeInputProps = {
  id?: string;
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
  className?: string;
};

export function RecordTimeInput({
  id = "time",
  label = "Hora",
  value,
  onChange,
  disabled,
  className,
}: RecordTimeInputProps) {
  return (
    <div className={cn("min-w-0 space-y-2", className)}>
      <Label
        htmlFor={id}
        className="px-1 text-xs font-semibold text-muted-foreground"
      >
        {label}
      </Label>
      <div className="relative flex h-12 items-center gap-2 rounded-2xl bg-secondary px-3.5 transition-colors focus-within:ring-3 focus-within:ring-ring/50 hover:bg-secondary/70 has-disabled:opacity-50">
        <Clock
          className="pointer-events-none size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <input
          id={id}
          type="time"
          disabled={disabled}
          value={formatOccurrenceTime(value)}
          onChange={(event) => {
            onChange(mergeOccurrenceTime(value, event.target.value));
          }}
          className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-sm font-semibold text-foreground outline-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
        />
      </div>
    </div>
  );
}
