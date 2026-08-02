import { cn } from "@/lib/utils";

type WizardProgressStepProps = {
  currentStep: number;
  index: number;
  label: string;
};

export function WizardProgressStep({
  currentStep,
  index,
  label,
}: WizardProgressStepProps) {
  const completed = index < currentStep;
  const current = index === currentStep;

  return (
    <li className="flex-1" aria-current={current ? "step" : undefined}>
      <span
        className={cn(
          "block h-1.5 w-full rounded-full transition-colors duration-200 motion-reduce:transition-none",
          completed || current ? "bg-primary" : "bg-foreground/10",
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </li>
  );
}
