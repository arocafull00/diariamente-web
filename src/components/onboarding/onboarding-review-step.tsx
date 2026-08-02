import { HeartHandshake, Stethoscope, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { OnboardingFormValues } from "@/components/onboarding/onboarding-types";
import { getInitials } from "@/lib/utils-app";

type OnboardingReviewStepProps = {
  values: OnboardingFormValues;
};

export function OnboardingReviewStep({ values }: OnboardingReviewStepProps) {
  const isPatient = values.role === "patient";
  const RoleIcon = isPatient ? HeartHandshake : Stethoscope;

  return (
    <dl className="divide-y divide-border overflow-hidden rounded-xl bg-secondary/65 px-4 sm:px-5">
      <div className="flex items-center gap-4 py-4">
        {values.avatarUrl ? (
          <Avatar className="size-10 shrink-0">
            <AvatarImage src={values.avatarUrl} alt="" />
            <AvatarFallback>
              {getInitials(values.firstName, values.lastName)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
            <UserRound aria-hidden="true" className="size-5" />
          </span>
        )}
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
