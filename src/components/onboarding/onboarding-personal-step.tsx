import { CircleAlert, UserRound } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import { AvatarPicker } from "@/components/avatars/avatar-picker";
import type { OnboardingFormValues } from "@/components/onboarding/onboarding-types";
import { GrammaticalGenderField } from "@/components/profile/grammatical-gender-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GRAMMATICAL_GENDER_QUESTION } from "@/lib/grammatical-gender";

type OnboardingPersonalStepProps = {
  control: Control<OnboardingFormValues>;
  errors: FieldErrors<OnboardingFormValues>;
  register: UseFormRegister<OnboardingFormValues>;
};

export function OnboardingPersonalStep({
  control,
  errors,
  register,
}: OnboardingPersonalStepProps) {
  return (
    <div className="grid gap-5">
      <div className="space-y-2.5" data-cuelume-theme="press">
        <Label className="font-semibold">Elige tu foto de perfil</Label>
        <Controller
          control={control}
          name="avatarUrl"
          render={({ field }) => (
            <AvatarPicker selectedUrl={field.value} onSelect={field.onChange} />
          )}
        />
      </div>
      <div className="space-y-2.5">
        <Label htmlFor="firstName" className="font-semibold">Nombre</Label>
        <div className="relative">
          <UserRound
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground/55"
            aria-hidden="true"
          />
          <Input
            id="firstName"
            autoComplete="given-name"
            autoFocus
            placeholder="Tu nombre"
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className="h-12 bg-background pl-10 pr-3 placeholder:text-foreground/65"
            {...register("firstName")}
          />
        </div>
        {errors.firstName ? (
          <p id="firstName-error" className="flex items-center gap-1.5 text-sm font-medium text-destructive">
            <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            {errors.firstName.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2.5">
        <Label htmlFor="lastName" className="font-semibold">Apellidos</Label>
        <div className="relative">
          <UserRound
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground/55"
            aria-hidden="true"
          />
          <Input
            id="lastName"
            autoComplete="family-name"
            placeholder="Tus apellidos"
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className="h-12 bg-background pl-10 pr-3 placeholder:text-foreground/65"
            {...register("lastName")}
          />
        </div>
        {errors.lastName ? (
          <p id="lastName-error" className="flex items-center gap-1.5 text-sm font-medium text-destructive">
            <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            {errors.lastName.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2.5" data-cuelume-theme="press">
        <Controller
          control={control}
          name="grammaticalGender"
          render={({ field }) => (
            <GrammaticalGenderField
              name={field.name}
              legend={GRAMMATICAL_GENDER_QUESTION}
              legendClassName="text-sm font-semibold"
              value={field.value}
              onChange={field.onChange}
              inputRef={field.ref}
              errorId={
                errors.grammaticalGender ? "grammaticalGender-error" : undefined
              }
            />
          )}
        />
        {errors.grammaticalGender ? (
          <p id="grammaticalGender-error" className="flex items-center gap-1.5 text-sm font-medium text-destructive">
            <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            {errors.grammaticalGender.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
