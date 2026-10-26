import type { GrammaticalGender } from "@/db/schema";

export const GRAMMATICAL_GENDER_OPTIONS: {
  value: GrammaticalGender;
  label: string;
}[] = [
  { value: "masculine", label: "Él" },
  { value: "feminine", label: "Ella" },
  { value: "unspecified", label: "Prefiero no decirlo" },
];

export const GRAMMATICAL_GENDER_QUESTION = "¿Cómo prefieres que te llame?";

export function getGrammaticalGenderLabel(gender: GrammaticalGender) {
  return (
    GRAMMATICAL_GENDER_OPTIONS.find((option) => option.value === gender)
      ?.label ?? ""
  );
}

export function getPsychologistNoun(gender: GrammaticalGender) {
  if (gender === "feminine") {
    return "psicóloga";
  }

  if (gender === "masculine") {
    return "psicólogo";
  }

  return "profesional";
}
