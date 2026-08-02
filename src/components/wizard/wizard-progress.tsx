import { WizardProgressStep } from "@/components/wizard/wizard-progress-step";

type WizardProgressProps = {
  step: number;
  steps: readonly string[];
  ariaLabel?: string;
};

export function WizardProgress({
  step,
  steps,
  ariaLabel = "Progreso",
}: WizardProgressProps) {
  const currentLabel = steps[step] ?? "";

  return (
    <nav aria-label={ariaLabel} className="w-full">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <span className="text-sm font-semibold text-foreground">{currentLabel}</span>
        <span className="text-sm font-medium text-foreground/65">
          Paso {step + 1} de {steps.length}
        </span>
      </div>
      <ol className="flex items-center gap-2">
        {steps.map((label, index) => (
          <WizardProgressStep
            key={label}
            currentStep={step}
            index={index}
            label={label}
          />
        ))}
      </ol>
    </nav>
  );
}
