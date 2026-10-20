import { Check } from "lucide-react";
import type { Ref } from "react";

import { cn } from "@/lib/utils";

type GrammaticalGenderOptionProps = {
  name: string;
  value: string;
  label: string;
  selected: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onSelect: () => void;
};

export function GrammaticalGenderOption({
  name,
  value,
  label,
  selected,
  inputRef,
  onSelect,
}: GrammaticalGenderOptionProps) {
  return (
    <label className="cursor-pointer">
      <input
        ref={inputRef}
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
          selected
            ? "border-primary bg-secondary text-foreground"
            : "border-border bg-background text-foreground hover:border-primary/45 hover:bg-secondary/45",
        )}
      >
        {selected ? (
          <Check className="size-4 text-primary" aria-hidden="true" />
        ) : null}
        {label}
      </span>
    </label>
  );
}
