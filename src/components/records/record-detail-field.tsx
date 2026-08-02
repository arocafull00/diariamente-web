import type { LucideIcon } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

type RecordDetailFieldProps = {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
};

export function RecordDetailField({
  id,
  icon: Icon,
  label,
  value,
  editable,
  onChange,
}: RecordDetailFieldProps) {
  return (
    <div className="space-y-3 p-4 sm:p-5">
      <div
        id={`${id}-label`}
        className="flex items-center gap-2 text-sm leading-none font-medium"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="font-semibold">{label}</span>
      </div>
      {editable ? (
        <Textarea
          id={id}
          aria-labelledby={`${id}-label`}
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-28 resize-y border-0 bg-secondary/55 px-3 py-3 leading-6 shadow-none focus-visible:bg-card focus-visible:ring-2"
        />
      ) : (
        <p
          className="max-w-[70ch] text-sm leading-6 text-pretty sm:text-base"
          aria-labelledby={`${id}-label`}
        >
          {value}
        </p>
      )}
    </div>
  );
}
