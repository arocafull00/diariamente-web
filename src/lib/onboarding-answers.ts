export const ACQUISITION_SOURCES = [
  "instagram",
  "tiktok",
  "google",
  "psychologist",
  "colleague",
  "friends",
  "linkedin",
  "app_store",
  "other",
] as const;

export const PATIENT_GOALS = ["understand", "therapy", "anxiety", "vent"] as const;

export const PSYCHOLOGIST_GOALS = ["context", "homework", "progress", "time"] as const;

export const ONBOARDING_GOALS = [...PATIENT_GOALS, ...PSYCHOLOGIST_GOALS] as const;

export const THERAPY_STATUSES = ["in_therapy", "looking", "not_yet"] as const;

export const RECORDS_EXPERIENCES = ["never", "paper", "with_psychologist"] as const;

export const CASELOADS = ["starting", "up_to_10", "up_to_30", "more_than_30"] as const;
