import { Check, type LucideIcon } from "lucide-react";
import type { Ref } from "react";

type OnboardingRoleOptionProps = {
  description: string;
  icon: LucideIcon;
  inputRef?: Ref<HTMLInputElement>;
  label: string;
  name: string;
  onSelect: () => void;
  selected: boolean;
  value: string;
};

export function OnboardingRoleOption({
  description,
  icon: Icon,
  inputRef,
  label,
  name,
  onSelect,
  selected,
  value,
}: OnboardingRoleOptionProps) {
  return (
    <label className="block cursor-pointer">
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
        className={`flex min-h-36 w-full flex-col items-start rounded-xl border p-4 text-left outline-none transition-colors duration-200 peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 ${
          selected
            ? "border-primary bg-secondary text-foreground"
            : "border-border bg-background text-foreground hover:border-primary/45 hover:bg-secondary/45"
        }`}
      >
        <span className="flex w-full items-start justify-between gap-3">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
              selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/65"
            }`}
          >
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <span
            aria-hidden="true"
            className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background"
            }`}
          >
            {selected ? <Check className="size-3.5" /> : null}
          </span>
        </span>
        <span className="mt-4 min-w-0 flex-1">
          <span className="block font-bold">{label}</span>
          <span className="mt-1 block text-sm leading-5 text-foreground/65">
            {description}
          </span>
        </span>
      </span>
    </label>
  );
}
