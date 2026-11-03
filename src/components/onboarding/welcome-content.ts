import type { OnboardingGoal } from "@/db/schema";
import type { FaceId } from "@/lib/faces";

export type WelcomeTone = "hp" | "lu" | "hu" | "lp";

export type WelcomeFeature = {
  faceId: FaceId;
  title: string;
  description: string;
};

export type WelcomeGoal = {
  id: OnboardingGoal;
  faceId: FaceId;
  tone: WelcomeTone;
  label: string;
  replyTitle: string;
  replyDescription: string;
};

export type WelcomeStepId =
  | "connect"
  | "notifications"
  | "invite"
  | "install"
  | "ready";

export type WelcomeStep = {
  id: WelcomeStepId;
  faceId: FaceId;
  title: string;
  description: string;
  faceRow?: readonly FaceId[];
};

const INSTALL_STEP: WelcomeStep = {
  id: "install",
  faceId: "04_naranja_amarillo",
  title: "¡Llévame en el bolsillo!",
  description:
    "Añade Diariamente a tu pantalla de inicio para abrirla como una app, sin pasar por el navegador.",
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
    id: "notifications",
    faceId: "04_naranja_amarillo",
    title: "¿Te aviso de lo importante?",
    description:
      "Así tu psicólogo/a podrá recordarte cosas entre sesiones y cada noche te avisaré para registrar tu día.",
  },
  INSTALL_STEP,
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
    id: "invite",
    faceId: "05_rosa_verde",
    title: "Invita a tu primer paciente",
    description:
      "Comparte tu enlace. Cuando tu paciente lo abra, recibirás una solicitud para aceptarla.",
  },
  {
    id: "notifications",
    faceId: "04_naranja_amarillo",
    title: "No te pierdas nada",
    description:
      "Te avisaré cuando un paciente quiera conectar contigo o añada un registro nuevo.",
  },
  INSTALL_STEP,
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
