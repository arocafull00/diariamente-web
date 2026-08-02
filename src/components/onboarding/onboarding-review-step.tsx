import { HeartHandshake, Stethoscope, UserRound } from "lucide-react";

import type { OnboardingFormValues } from "@/components/onboarding/onboarding-types";

type OnboardingReviewStepProps = {
  values: OnboardingFormValues;
};

export function OnboardingReviewStep({ values }: OnboardingReviewStepProps) {
  const isPatient = values.role === "patient";
  const RoleIcon = isPatient ? HeartHandshake : Stethoscope;

  return (
    <dl className="divide-y divide-border overflow-hidden rounded-xl bg-secondary/65 px-4 sm:px-5">
      <div className="flex items-center gap-4 py-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
          <UserRound aria-hidden="true" className="size-5" />
        </span>
        <div>
          <dt className="text-sm font-medium text-foreground/65">Nombre</dt>
          <dd className="mt-0.5 font-semibold">
            {values.firstName} {values.lastName}
          </dd>
        </div>
      </div>
      <div className="flex items-center gap-4 py-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
          <RoleIcon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <dt className="text-sm font-medium text-foreground/65">Tipo de perfil</dt>
          <dd className="mt-0.5 font-semibold">
            {isPatient ? "Paciente" : "Profesional de la psicología"}
          </dd>
        </div>
      </div>
    </dl>
  );
}
