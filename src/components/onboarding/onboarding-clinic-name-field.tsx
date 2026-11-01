import { Building2, CircleAlert } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";

import type { OnboardingFormValues } from "@/components/onboarding/onboarding-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OnboardingClinicNameFieldProps = {
  error?: string;
  register: UseFormRegister<OnboardingFormValues>;
};

export function OnboardingClinicNameField({
  error,
  register,
}: OnboardingClinicNameFieldProps) {
  return (
    <div className="mt-5 space-y-2.5">
      <Label htmlFor="clinicName" className="font-semibold">
        Nombre de la clínica
      </Label>
      <div className="relative">
        <Building2
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground/55"
          aria-hidden="true"
        />
        <Input
          id="clinicName"
          autoComplete="organization"
          placeholder="Nombre de tu centro"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "clinicName-error" : undefined}
          className="h-12 bg-background pl-10 pr-3 placeholder:text-foreground/65"
          {...register("clinicName")}
        />
      </div>
      {error ? (
        <p id="clinicName-error" className="flex items-center gap-1.5 text-sm font-medium text-destructive">
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
