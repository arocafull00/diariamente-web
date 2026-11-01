import { Building2, HeartHandshake, Stethoscope } from "lucide-react";
import type { Ref } from "react";
import type { UseFormRegister } from "react-hook-form";

import { OnboardingClinicNameField } from "@/components/onboarding/onboarding-clinic-name-field";
import { OnboardingRoleOption } from "@/components/onboarding/onboarding-role-option";
import type { OnboardingFormValues } from "@/components/onboarding/onboarding-types";

type OnboardingRoleStepProps = {
  clinicNameError?: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  name: string;
  onChange: (role: OnboardingFormValues["role"]) => void;
  register: UseFormRegister<OnboardingFormValues>;
  value?: OnboardingFormValues["role"];
};

export function OnboardingRoleStep({
  clinicNameError,
  error,
  inputRef,
  name,
  onChange,
  register,
  value,
}: OnboardingRoleStepProps) {
  return (
    <div>
      <fieldset
        aria-describedby={error ? "role-error" : undefined}
        className="grid gap-3"
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
        <OnboardingRoleOption
          icon={Building2}
          label="Clínica"
          name={name}
          description="Quiero gestionar el equipo de psicólogos de mi centro."
          selected={value === "clinic"}
          onSelect={() => onChange("clinic")}
          value="clinic"
        />
      </fieldset>
      {value === "clinic" ? (
        <OnboardingClinicNameField error={clinicNameError} register={register} />
      ) : null}
      {error ? (
        <p id="role-error" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
