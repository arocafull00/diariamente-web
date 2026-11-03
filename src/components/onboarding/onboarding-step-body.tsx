"use client";

import { AvatarPicker } from "@/components/avatars/avatar-picker";
import { OnboardingAchieveStep } from "@/components/onboarding/onboarding-achieve-step";
import { OnboardingChoiceList } from "@/components/onboarding/onboarding-choice-list";
import {
  CASELOAD_CHOICES,
  EXPERIENCE_CHOICES,
  GENDER_CHOICES,
  GOAL_CHOICES,
  HOW_IT_WORKS_FEATURES,
  PRIVACY_FEATURES,
  ROLE_CHOICES,
  SCIENCE_FINDINGS,
  SOURCE_CHOICES_BY_ROLE,
  THERAPY_CHOICES,
  type OnboardingStepId,
} from "@/components/onboarding/onboarding-content";
import { OnboardingNameFields } from "@/components/onboarding/onboarding-name-fields";
import { OnboardingScienceStep } from "@/components/onboarding/onboarding-science-step";
import { OnboardingTextInput } from "@/components/onboarding/onboarding-text-input";
import { WelcomeFeatureList } from "@/components/onboarding/welcome-feature-list";
import { WelcomeGoalList } from "@/components/onboarding/welcome-goal-list";
import { WelcomeTrustCircle } from "@/components/onboarding/welcome-trust-circle";
import type { OnboardingAnswers } from "@/stores/onboarding-store";

type OnboardingStepBodyProps = {
  stepId: OnboardingStepId;
  answers: OnboardingAnswers;
  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  onSubmit: () => void;
};

export function OnboardingStepBody({
  stepId,
  answers,
  setAnswer,
  onSubmit,
}: OnboardingStepBodyProps) {
  const role = answers.role ?? "patient";
  const memberRole = role === "clinic" ? "psychologist" : role;

  switch (stepId) {
    case "role":
      return (
        <OnboardingChoiceList
          label="Tipo de cuenta"
          choices={ROLE_CHOICES}
          value={answers.role}
          columns={1}
          onSelect={(value) => setAnswer("role", value)}
        />
      );
    case "name":
      return (
        <OnboardingNameFields
          firstName={answers.firstName}
          lastName={answers.lastName}
          onFirstNameChange={(value) => setAnswer("firstName", value)}
          onLastNameChange={(value) => setAnswer("lastName", value)}
          onSubmit={onSubmit}
        />
      );
    case "clinic-name":
      return (
        <OnboardingTextInput
          id="onboarding-clinic-name"
          label="Nombre del centro"
          icon="clinica"
          value={answers.clinicName}
          placeholder="Nombre de tu centro"
          autoComplete="organization"
          autoFocus
          maxLength={120}
          onChange={(value) => setAnswer("clinicName", value)}
          onSubmit={onSubmit}
        />
      );
    case "gender":
      return (
        <OnboardingChoiceList
          label="Cómo prefieres que te hablemos"
          choices={GENDER_CHOICES}
          value={answers.grammaticalGender}
          columns={1}
          onSelect={(value) => setAnswer("grammaticalGender", value)}
        />
      );
    case "source":
      return (
        <OnboardingChoiceList
          label="Cómo nos has conocido"
          choices={SOURCE_CHOICES_BY_ROLE[role]}
          value={answers.acquisitionSource}
          columns={2}
          onSelect={(value) => setAnswer("acquisitionSource", value)}
        />
      );
    case "goal":
      return (
        <WelcomeGoalList
          goals={GOAL_CHOICES[memberRole]}
          selectedId={answers.goal}
          onSelect={(value) => setAnswer("goal", value)}
        />
      );
    case "therapy":
      return (
        <OnboardingChoiceList
          label="Si vas a terapia"
          choices={THERAPY_CHOICES}
          value={answers.therapyStatus}
          columns={1}
          onSelect={(value) => setAnswer("therapyStatus", value)}
        />
      );
    case "experience":
      return (
        <OnboardingChoiceList
          label="Tu experiencia con los registros"
          choices={EXPERIENCE_CHOICES}
          value={answers.recordsExperience}
          columns={1}
          onSelect={(value) => setAnswer("recordsExperience", value)}
        />
      );
    case "caseload":
      return (
        <OnboardingChoiceList
          label="Cuántos pacientes acompañas"
          choices={CASELOAD_CHOICES}
          value={answers.caseload}
          columns={1}
          onSelect={(value) => setAnswer("caseload", value)}
        />
      );
    case "how-it-works":
      return <WelcomeFeatureList features={HOW_IT_WORKS_FEATURES[memberRole]} />;
    case "science":
      return <OnboardingScienceStep findings={SCIENCE_FINDINGS[memberRole]} />;
    case "achieve":
      return <OnboardingAchieveStep />;
    case "safe-space":
      return <WelcomeTrustCircle />;
    case "privacy":
      return <WelcomeFeatureList features={PRIVACY_FEATURES} />;
    case "avatar":
      return (
        <AvatarPicker
          selectedUrl={answers.avatarUrl}
          onSelect={(value) => setAnswer("avatarUrl", value)}
        />
      );
    default:
      return null;
  }
}
