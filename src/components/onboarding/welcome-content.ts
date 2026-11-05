import type { OnboardingGoal } from "@/db/schema";
import type { FaceId } from "@/lib/faces";

export type WelcomeTone = "hp" | "lu" | "hu" | "lp";

export type WelcomeFeature = {
  faceId: FaceId;
  title: string;
};

export type WelcomeGoal = {
  id: OnboardingGoal;
  faceId: FaceId;
  tone: WelcomeTone;
  label: string;
};

export type WelcomeStepId = "connect" | "ready";

export type WelcomeStep = {
  id: WelcomeStepId;
  faceId: FaceId;
  title: string;
  description: string;
  faceRow?: readonly FaceId[];
};

const CELEBRATION_FACES: readonly FaceId[] = [
  "04_naranja_amarillo",
  "02_azul_rosa",
  "03_verde_morado",
  "05_rosa_verde",
];

export const CONNECT_STEP: WelcomeStep = {
  id: "connect",
  faceId: "01_gradiente",
  title: "Conecta con tu psicólogo/a",
  description:
    "Pídele su enlace de Diariamente. Al abrirlo, te preguntaremos si quieres compartir tus registros con él o ella.",
};

const PATIENT_STEPS: readonly WelcomeStep[] = [
  {
    id: "ready",
    faceId: "alegria",
    title: "¡Todo listo, {name}!",
    description:
      "Cuando pase algo que te remueva, abre Diariamente y cuéntamelo. ¿Hacemos el primero ahora?",
    faceRow: CELEBRATION_FACES,
  },
];

const PSYCHOLOGIST_STEPS: readonly WelcomeStep[] = [
  {
    id: "ready",
    faceId: "alegria",
    title: "¡Todo listo, {name}!",
    description:
      "En cuanto tus pacientes empiecen a registrar, verás sus novedades en la sección Pacientes.",
    faceRow: CELEBRATION_FACES,
  },
];

export const WELCOME_STEPS = {
  patient: PATIENT_STEPS,
  psychologist: PSYCHOLOGIST_STEPS,
} as const;
