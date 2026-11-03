import type { OnboardingChoice } from "@/components/onboarding/onboarding-content";
import { OnboardingChoiceOption } from "@/components/onboarding/onboarding-choice-option";
import { cn } from "@/lib/utils";

type OnboardingChoiceListProps<T extends string> = {
  label: string;
  choices: readonly OnboardingChoice<T>[];
  value: T | null;
  onSelect: (value: T) => void;
  columns: 1 | 2;
};

export function OnboardingChoiceList<T extends string>({
  label,
  choices,
  value,
  onSelect,
  columns,
}: OnboardingChoiceListProps<T>) {
  return (
    <ul
      role="radiogroup"
      aria-label={label}
      className={cn("grid gap-3", columns === 2 && "grid-cols-2")}
    >
      {choices.map((choice) => (
        <OnboardingChoiceOption
          key={choice.value}
          choice={choice}
          selected={choice.value === value}
          compact={columns === 2}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
