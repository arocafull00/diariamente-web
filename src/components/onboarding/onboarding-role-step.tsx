import { HeartHandshake, Stethoscope } from "lucide-react";
import type { Ref } from "react";

import { OnboardingRoleOption } from "@/components/onboarding/onboarding-role-option";
import type { OnboardingFormValues } from "@/components/onboarding/onboarding-types";

type OnboardingRoleStepProps = {
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  name: string;
  onChange: (role: OnboardingFormValues["role"]) => void;
  value?: OnboardingFormValues["role"];
};

export function OnboardingRoleStep({
  error,
  inputRef,
  name,
  onChange,
  value,
}: OnboardingRoleStepProps) {
  return (
    <div>
      <fieldset
        aria-describedby={error ? "role-error" : undefined}
        className="grid gap-3 sm:grid-cols-2"
      >
        <legend className="sr-only">Tipo de perfil</legend>
        <OnboardingRoleOption
          icon={HeartHandshake}
          inputRef={inputRef}
          label="Paciente"
          name={name}
          description="Quiero registrar y comprender cómo me siento."
          selected={value === "patient"}
          onSelect={() => onChange("patient")}
          value="patient"
        />
        <OnboardingRoleOption
          icon={Stethoscope}
          label="Profesional de la psicología"
          name={name}
          description="Quiero acompañar y revisar la evolución de mis pacientes."
          selected={value === "psychologist"}
          onSelect={() => onChange("psychologist")}
          value="psychologist"
        />
      </fieldset>
      {error ? (
        <p id="role-error" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
