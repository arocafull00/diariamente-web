import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type OnboardingProgressStepProps = {
  currentStep: number;
  index: number;
  label: string;
  totalSteps: number;
};

export function OnboardingProgressStep({
  currentStep,
  index,
  label,
  totalSteps,
}: OnboardingProgressStepProps) {
  const completed = index < currentStep;
  const current = index === currentStep;
  const isLast = index === totalSteps - 1;

  return (
    <li
      className={cn("flex items-center", !isLast && "flex-1")}
      aria-current={current ? "step" : undefined}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200",
          completed || current
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground/60",
        )}
      >
        {completed ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
      </span>
      <span
        className={cn(
          "ml-2 hidden text-sm sm:inline",
          current ? "font-semibold text-foreground" : "font-medium text-foreground/60",
        )}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "mx-2 h-1 flex-1 rounded-full sm:mx-3",
          isLast && "hidden",
          completed ? "bg-primary" : "bg-muted",
        )}
      />
    </li>
  );
}
