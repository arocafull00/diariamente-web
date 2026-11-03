"use client";

import { Illustration } from "@/components/faces/illustration";
import { Input } from "@/components/ui/input";
import type { IllustrationName } from "@/lib/illustrations";

type OnboardingTextInputProps = {
  id: string;
  label: string;
  icon: IllustrationName;
  value: string;
  placeholder: string;
  autoComplete: string;
  autoFocus: boolean;
  maxLength: number;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function OnboardingTextInput({
  id,
  label,
  icon,
  value,
  placeholder,
  autoComplete,
  autoFocus,
  maxLength,
  onChange,
  onSubmit,
}: OnboardingTextInputProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Illustration
        name={icon}
        className="pointer-events-none absolute top-1/2 left-3 size-8 -translate-y-1/2"
      />
      <Input
        id={id}
        value={value}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        autoCapitalize="words"
        maxLength={maxLength}
        placeholder={placeholder}
        enterKeyHint="next"
        className="h-14 rounded-2xl border-2 border-b-4 bg-card pr-4 pl-14 text-lg font-semibold placeholder:font-normal placeholder:text-foreground/50"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter") {
            return;
          }

          event.preventDefault();
          onSubmit();
        }}
      />
    </div>
  );
}
