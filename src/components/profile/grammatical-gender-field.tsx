import type { Ref } from "react";

import { GrammaticalGenderOption } from "@/components/profile/grammatical-gender-option";
import type { GrammaticalGender } from "@/db/schema";
import { GRAMMATICAL_GENDER_OPTIONS } from "@/lib/grammatical-gender";

type GrammaticalGenderFieldProps = {
  name: string;
  legend: string;
  value: GrammaticalGender | undefined;
  onChange: (gender: GrammaticalGender) => void;
  disabled?: boolean;
  errorId?: string;
  inputRef?: Ref<HTMLInputElement>;
  legendClassName?: string;
};

export function GrammaticalGenderField({
  name,
  legend,
  value,
  onChange,
  disabled = false,
  errorId,
  inputRef,
  legendClassName,
}: GrammaticalGenderFieldProps) {
  return (
    <fieldset
      aria-describedby={errorId}
      disabled={disabled}
      className="space-y-2.5"
    >
      <legend className={legendClassName}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {GRAMMATICAL_GENDER_OPTIONS.map((option, index) => (
          <GrammaticalGenderOption
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            selected={value === option.value}
            inputRef={index === 0 ? inputRef : undefined}
            onSelect={() => onChange(option.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}
