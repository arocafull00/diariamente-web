"use client";

import { OnboardingTextInput } from "@/components/onboarding/onboarding-text-input";

const LAST_NAME_INPUT_ID = "onboarding-last-name";

type OnboardingNameFieldsProps = {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSubmit: () => void;
};

export function OnboardingNameFields({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onSubmit,
}: OnboardingNameFieldsProps) {
  return (
    <div className="space-y-3">
      <OnboardingTextInput
        id="onboarding-first-name"
        label="Tu nombre"
        icon="perfil"
        value={firstName}
        placeholder="Tu nombre"
        autoComplete="given-name"
        autoFocus
        maxLength={80}
        onChange={onFirstNameChange}
        onSubmit={() => document.getElementById(LAST_NAME_INPUT_ID)?.focus()}
      />
      <OnboardingTextInput
        id={LAST_NAME_INPUT_ID}
        label="Tus apellidos"
        icon="perfil"
        value={lastName}
        placeholder="Tus apellidos"
        autoComplete="family-name"
        autoFocus={false}
        maxLength={120}
        onChange={onLastNameChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
