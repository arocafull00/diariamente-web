import type { LucideIcon } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type RecordDetailFieldProps = {
  id: string;
  icon: LucideIcon;
  label: string;
  placeholder: string;
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
};

export function RecordDetailField({
  id,
  icon: Icon,
  label,
  placeholder,
  value,
  editable,
  onChange,
}: RecordDetailFieldProps) {
  const isEmpty = value.trim().length === 0;

  return (
    <div className="space-y-3 p-5 sm:p-6">
      <div
        id={`${id}-label`}
        className="flex items-center gap-2 text-sm leading-none font-medium"
      >
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            isEmpty ? "bg-foreground/5 text-muted-foreground" : "bg-secondary text-primary",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="font-semibold">{label}</span>
        {isEmpty ? (
          <span className="ml-auto rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            Pendiente
          </span>
        ) : null}
      </div>
      {editable ? (
        <Textarea
          id={id}
          aria-labelledby={`${id}-label`}
          rows={4}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-28 resize-y rounded-2xl border-0 bg-secondary/55 px-4 py-3 font-display text-lg leading-snug shadow-none placeholder:text-muted-foreground/70 focus-visible:bg-card focus-visible:ring-2"
        />
      ) : (
        <p
          className={cn(
            "max-w-[70ch] font-display text-lg leading-snug text-pretty",
            isEmpty && "text-base text-muted-foreground italic",
          )}
          aria-labelledby={`${id}-label`}
        >
          {isEmpty ? "Sin completar" : value}
        </p>
      )}
    </div>
  );
}
