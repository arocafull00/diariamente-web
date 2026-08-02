"use client";

import { Input } from "@/components/ui/input";
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
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="time"
        disabled={disabled}
        value={formatOccurrenceTime(value)}
        onChange={(event) => {
          onChange(mergeOccurrenceTime(value, event.target.value));
        }}
      />
    </div>
  );
}
