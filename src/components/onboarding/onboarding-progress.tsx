import { OnboardingProgressStep } from "@/components/onboarding/onboarding-progress-step";

type OnboardingProgressProps = {
  step: number;
};

export function OnboardingProgress({ step }: OnboardingProgressProps) {
  const currentLabel =
    step === 0 ? "Tus datos" : step === 1 ? "Tu perfil" : "Confirmación";

  return (
    <nav aria-label="Progreso del registro" className="w-full">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <span className="text-sm font-semibold text-foreground">{currentLabel}</span>
        <span className="text-sm font-medium text-foreground/65">Paso {step + 1} de 3</span>
      </div>
      <ol className="flex items-center">
        <OnboardingProgressStep
          currentStep={step}
          index={0}
          label="Tus datos"
          totalSteps={3}
        />
        <OnboardingProgressStep
          currentStep={step}
          index={1}
          label="Tu perfil"
          totalSteps={3}
        />
        <OnboardingProgressStep
          currentStep={step}
          index={2}
          label="Confirmación"
          totalSteps={3}
        />
      </ol>
    </nav>
  );
}
