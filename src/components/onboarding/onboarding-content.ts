import type {
  WelcomeFeature,
  WelcomeGoal,
  WelcomeTone,
} from "@/components/onboarding/welcome-content";
import type {
  AcquisitionSource,
  Caseload,
  GrammaticalGender,
  RecordsExperience,
  TherapyStatus,
} from "@/db/schema";
import type { FaceId } from "@/lib/faces";
import type { IllustrationName } from "@/lib/illustrations";
import type { OnboardingRole } from "@/stores/onboarding-store";

export const ONBOARDING_PROGRESS_SHARE = 0.8;

export type OnboardingStepId =
  | "role"
  | "hello"
  | "name"
  | "gender"
  | "source"
  | "goal"
  | "therapy"
  | "experience"
  | "caseload"
  | "clinic-name"
  | "how-it-works"
  | "science"
  | "achieve"
  | "safe-space"
  | "privacy"
  | "avatar"
  | "account";

export type OnboardingStep = {
  id: OnboardingStepId;
  faceId: FaceId;
  title: string;
  hero?: boolean;
};

export type OnboardingChoice<T extends string> = {
  value: T;
  label: string;
  icon: IllustrationName;
  tone: WelcomeTone;
};

export type ScienceFinding = {
  id: string;
  icon: IllustrationName;
  tone: WelcomeTone;
  title: string;
  description: string;
  source: string;
  citation: string;
  url: string;
};

export type OnboardingAchievement = {
  icon: IllustrationName;
  tone: WelcomeTone;
  title: string;
};

export const ROLE_CHOICES: readonly OnboardingChoice<OnboardingRole>[] = [
  {
    value: "patient",
    label: "Paciente",
    icon: "perfil",
    tone: "lp",
  },
  {
    value: "psychologist",
    label: "Psicólogo/a",
    icon: "equipo",
    tone: "lu",
  },
  {
    value: "clinic",
    label: "Clínica",
    icon: "clinica",
    tone: "hp",
  },
];

export const GENDER_CHOICES: readonly OnboardingChoice<GrammaticalGender>[] = [
  {
    value: "feminine",
    label: "Ella",
    icon: "sugerencias",
    tone: "hu",
  },
  {
    value: "masculine",
    label: "Él",
    icon: "sugerencias",
    tone: "lu",
  },
  {
    value: "unspecified",
    label: "Prefiero no decirlo",
    icon: "sugerencias",
    tone: "lp",
  },
];

const SOURCE_CHOICES: Record<AcquisitionSource, OnboardingChoice<AcquisitionSource>> = {
  instagram: { value: "instagram", label: "Instagram", icon: "camara", tone: "hu" },
  tiktok: { value: "tiktok", label: "TikTok", icon: "musica", tone: "lu" },
  google: { value: "google", label: "Google", icon: "buscar", tone: "hp" },
  psychologist: {
    value: "psychologist",
    label: "Mi psicólogo/a",
    icon: "equipo",
    tone: "lp",
  },
  colleague: {
    value: "colleague",
    label: "Un compañero/a",
    icon: "equipo",
    tone: "lp",
  },
  friends: { value: "friends", label: "Amigos o familia", icon: "compartir-equipo", tone: "hu" },
  linkedin: { value: "linkedin", label: "LinkedIn", icon: "compartir-equipo", tone: "lu" },
  app_store: { value: "app_store", label: "Tienda de apps", icon: "tienda", tone: "lu" },
  other: { value: "other", label: "Otro", icon: "descubrir", tone: "hp" },
};

export const SOURCE_CHOICES_BY_ROLE: Record<
  OnboardingRole,
  readonly OnboardingChoice<AcquisitionSource>[]
> = {
  patient: [
    SOURCE_CHOICES.psychologist,
    SOURCE_CHOICES.instagram,
    SOURCE_CHOICES.tiktok,
    SOURCE_CHOICES.google,
    SOURCE_CHOICES.friends,
    SOURCE_CHOICES.app_store,
    SOURCE_CHOICES.other,
  ],
  psychologist: [
    SOURCE_CHOICES.colleague,
    SOURCE_CHOICES.instagram,
    SOURCE_CHOICES.linkedin,
    SOURCE_CHOICES.google,
    SOURCE_CHOICES.tiktok,
    SOURCE_CHOICES.friends,
    SOURCE_CHOICES.other,
  ],
  clinic: [
    SOURCE_CHOICES.colleague,
    SOURCE_CHOICES.linkedin,
    SOURCE_CHOICES.google,
    SOURCE_CHOICES.instagram,
    SOURCE_CHOICES.friends,
    SOURCE_CHOICES.other,
  ],
};

export const THERAPY_CHOICES: readonly OnboardingChoice<TherapyStatus>[] = [
  { value: "in_therapy", label: "Sí, tengo psicólogo/a", icon: "equipo", tone: "lp" },
  { value: "looking", label: "Lo estoy buscando", icon: "buscar", tone: "lu" },
  { value: "not_yet", label: "Todavía no", icon: "crecer", tone: "hp" },
];

export const EXPERIENCE_CHOICES: readonly OnboardingChoice<RecordsExperience>[] = [
  { value: "never", label: "Nunca he hecho uno", icon: "descubrir", tone: "hp" },
  {
    value: "paper",
    label: "Alguna vez, en papel o en notas",
    icon: "registros",
    tone: "lu",
  },
  {
    value: "with_psychologist",
    label: "Sí, con mi psicólogo/a",
    icon: "aceptar-invitacion",
    tone: "lp",
  },
];

export const CASELOAD_CHOICES: readonly OnboardingChoice<Caseload>[] = [
  { value: "starting", label: "Estoy empezando", icon: "crecer", tone: "hp" },
  { value: "up_to_10", label: "Entre 1 y 10", icon: "perfil", tone: "lu" },
  { value: "up_to_30", label: "Entre 11 y 30", icon: "equipo", tone: "lp" },
  { value: "more_than_30", label: "Más de 30", icon: "compartir-equipo", tone: "hu" },
];

export const GOAL_CHOICES: Record<"patient" | "psychologist", readonly WelcomeGoal[]> = {
  patient: [
    {
      id: "understand",
      faceId: "alegria",
      tone: "hp",
      label: "Entender mejor mis emociones",
    },
    {
      id: "therapy",
      faceId: "01_gradiente",
      tone: "lu",
      label: "Aprovechar más mis sesiones de terapia",
    },
    {
      id: "anxiety",
      faceId: "ansiedad",
      tone: "hu",
      label: "Gestionar la ansiedad o el estrés",
    },
    {
      id: "vent",
      faceId: "tristeza",
      tone: "lp",
      label: "Desahogarme y ordenar mis ideas",
    },
  ],
  psychologist: [
    {
      id: "context",
      faceId: "alegria",
      tone: "hp",
      label: "Llegar a cada sesión con más contexto",
    },
    {
      id: "homework",
      faceId: "01_gradiente",
      tone: "lu",
      label: "Que mis pacientes registren entre sesiones",
    },
    {
      id: "progress",
      faceId: "05_rosa_verde",
      tone: "lp",
      label: "Seguir su evolución emocional",
    },
    {
      id: "time",
      faceId: "04_naranja_amarillo",
      tone: "hu",
      label: "Ahorrar tiempo recogiendo información",
    },
  ],
};

export const HOW_IT_WORKS_FEATURES: Record<"patient" | "psychologist", readonly WelcomeFeature[]> = {
  patient: [
    {
      faceId: "alegria",
      title: "Cómo te sientes",
    },
    {
      faceId: "02_azul_rosa",
      title: "En qué contexto",
    },
    {
      faceId: "05_rosa_verde",
      title: "Dónde lo notas",
    },
    {
      faceId: "03_verde_morado",
      title: "Profundiza",
    },
  ],
  psychologist: [
    {
      faceId: "alegria",
      title: "Tus pacientes en un lugar",
    },
    {
      faceId: "02_azul_rosa",
      title: "Registros completos",
    },
    {
      faceId: "04_naranja_amarillo",
      title: "Novedades de un vistazo",
    },
    {
      faceId: "03_verde_morado",
      title: "Tus notas",
    },
  ],
};

export const PRIVACY_FEATURES: readonly WelcomeFeature[] = [
  {
    faceId: "01_gradiente",
    title: "Solo quien te elige",
  },
  {
    faceId: "05_rosa_verde",
    title: "El paciente decide",
  },
  {
    faceId: "02_azul_rosa",
    title: "Avisos discretos",
  },
];

export const SCIENCE_FINDINGS: Record<"patient" | "psychologist", readonly ScienceFinding[]> = {
  patient: [
    {
      id: "lieberman-2007",
      icon: "etiqueta",
      tone: "lu",
      title: "Nombrar lo que sientes lo calma",
      description:
        "Nombrar una emoción redujo la actividad de la amígdala, la zona del cerebro que dispara la alarma.",
      source: "Psychological Science · 2007",
      citation:
        "Lieberman, M. D., et al. (2007). Putting feelings into words: Affect labeling disrupts amygdala activity in response to affective stimuli. Psychological Science, 18(5), 421–428.",
      url: "https://doi.org/10.1111/j.1467-9280.2007.01916.x",
    },
    {
      id: "kauer-2012",
      icon: "perfil",
      tone: "lp",
      title: "Registrarte te ayuda a conocerte",
      description:
        "En un ensayo clínico, registrar el ánimo con el móvil aumentó la autoconciencia emocional, y con ella bajaron los síntomas depresivos.",
      source: "Ensayo clínico · 2012",
      citation:
        "Kauer, S. D., et al. (2012). Self-monitoring using mobile phones in the early stages of adolescent depression: Randomized controlled trial. Journal of Medical Internet Research, 14(3), e67.",
      url: "https://doi.org/10.2196/jmir.1858",
    },
    {
      id: "frattaroli-2006",
      icon: "registros",
      tone: "hp",
      title: "Escribir lo que vives sienta bien",
      description:
        "Al revisar 146 estudios, escribir sobre lo que se siente mostró beneficios pequeños pero consistentes.",
      source: "146 estudios · 2006",
      citation:
        "Frattaroli, J. (2006). Experimental disclosure and its moderators: A meta-analysis. Psychological Bulletin, 132(6), 823–865.",
      url: "https://doi.org/10.1037/0033-2909.132.6.823",
    },
  ],
  psychologist: [
    {
      id: "kazantzis-2016",
      icon: "aceptar-invitacion",
      tone: "lp",
      title: "Lo que pasa entre sesiones cuenta",
      description:
        "En TCC, completar más tareas entre sesiones se asocia con mejores resultados (g = 0,79 en 15 estudios).",
      source: "Behavior Therapy · 2016",
      citation:
        "Kazantzis, N., Whittington, C., Zelencich, L., Kyrios, M., Norton, P. J., & Hofmann, S. G. (2016). Quantity and quality of homework compliance: A meta-analysis of relations with outcome in cognitive behavior therapy. Behavior Therapy, 47(5), 755–772.",
      url: "https://doi.org/10.1016/j.beth.2016.05.002",
    },
    {
      id: "shiffman-2008",
      icon: "reloj",
      tone: "lu",
      title: "Anotar al momento gana a la memoria",
      description:
        "Anotar lo vivido al momento evita los sesgos de recordarlo días después, ya en consulta.",
      source: "Annual Review · 2008",
      citation:
        "Shiffman, S., Stone, A. A., & Hufford, M. R. (2008). Ecological momentary assessment. Annual Review of Clinical Psychology, 4, 1–32.",
      url: "https://doi.org/10.1146/annurev.clinpsy.3.022806.091415",
    },
    {
      id: "lambert-2018",
      icon: "evolucion",
      tone: "hp",
      title: "Seguir la evolución mejora la terapia",
      description:
        "Monitorizar el progreso redujo los empeoramientos y casi duplicó la mejoría en pacientes con peor pronóstico.",
      source: "24 estudios · 2018",
      citation:
        "Lambert, M. J., Whipple, J. L., & Kleinstäuber, M. (2018). Collecting and delivering progress feedback: A meta-analysis of routine outcome monitoring. Psychotherapy, 55(4), 520–537.",
      url: "https://doi.org/10.1037/pst0000167",
    },
  ],
};

export const PATIENT_ACHIEVEMENTS: readonly OnboardingAchievement[] = [
  {
    icon: "perfil",
    tone: "hp",
    title: "Entender lo que sientes",
  },
  {
    icon: "evolucion",
    tone: "lp",
    title: "Ver tu evolución",
  },
  {
    icon: "equipo",
    tone: "lu",
    title: "Aprovechar más la terapia",
  },
];

const ROLE_STEP: OnboardingStep = {
  id: "role",
  faceId: "01_gradiente",
  title: "¿Cómo vas a usar Diariamente?",
};

const GENDER_STEP: OnboardingStep = {
  id: "gender",
  faceId: "alegria",
  title: "¡Encantados, {name}! ¿Cómo prefieres que te hablemos?",
};

const SOURCE_STEP: OnboardingStep = {
  id: "source",
  faceId: "04_naranja_amarillo",
  title: "¿Cómo nos has conocido?",
};

const ACCOUNT_STEP: OnboardingStep = {
  id: "account",
  faceId: "04_naranja_amarillo",
  title: "¡Guarda tu progreso, {name}!",
};

const PROFESSIONAL_ACCOUNT_STEP: OnboardingStep = {
  ...ACCOUNT_STEP,
};

const PATIENT_STEPS: readonly OnboardingStep[] = [
  ROLE_STEP,
  {
    id: "hello",
    faceId: "alegria",
    title: "¡Hola! Soy tu diario emocional",
    hero: true,
  },
  {
    id: "name",
    faceId: "02_azul_rosa",
    title: "¿Cómo te podemos llamar?",
  },
  GENDER_STEP,
  SOURCE_STEP,
  {
    id: "goal",
    faceId: "01_gradiente",
    title: "¿Qué te trae por aquí?",
  },
  {
    id: "therapy",
    faceId: "03_verde_morado",
    title: "¿Ahora mismo vas a terapia?",
  },
  {
    id: "experience",
    faceId: "05_rosa_verde",
    title: "¿Has hecho registros emocionales antes?",
  },
  {
    id: "how-it-works",
    faceId: "02_azul_rosa",
    title: "Así es un registro",
  },
  {
    id: "science",
    faceId: "01_gradiente",
    title: "Esto no nos lo inventamos",
  },
  {
    id: "achieve",
    faceId: "alegria",
    title: "Esto es lo que vas a conseguir",
  },
  {
    id: "safe-space",
    faceId: "03_verde_morado",
    title: "Este es tu espacio seguro",
  },
  {
    id: "avatar",
    faceId: "05_rosa_verde",
    title: "Elige tu cara",
  },
  ACCOUNT_STEP,
];

const PSYCHOLOGIST_STEPS: readonly OnboardingStep[] = [
  ROLE_STEP,
  {
    id: "hello",
    faceId: "alegria",
    title: "¡Hola! Encantados de conocerte",
    hero: true,
  },
  {
    id: "name",
    faceId: "02_azul_rosa",
    title: "¿Cómo te podemos llamar?",
  },
  GENDER_STEP,
  SOURCE_STEP,
  {
    id: "goal",
    faceId: "01_gradiente",
    title: "¿Qué te gustaría conseguir?",
  },
  {
    id: "caseload",
    faceId: "03_verde_morado",
    title: "¿Cuántos pacientes acompañas ahora?",
  },
  {
    id: "how-it-works",
    faceId: "02_azul_rosa",
    title: "Así trabajarás conmigo",
  },
  {
    id: "science",
    faceId: "01_gradiente",
    title: "Esto no nos lo inventamos",
  },
  {
    id: "privacy",
    faceId: "03_verde_morado",
    title: "La privacidad, lo primero",
  },
  {
    id: "avatar",
    faceId: "05_rosa_verde",
    title: "Elige tu cara",
  },
  PROFESSIONAL_ACCOUNT_STEP,
];

const CLINIC_STEPS: readonly OnboardingStep[] = [
  ROLE_STEP,
  {
    id: "hello",
    faceId: "alegria",
    title: "¡Hola! Preparemos vuestro centro",
    hero: true,
  },
  {
    id: "name",
    faceId: "02_azul_rosa",
    title: "¿Cómo te podemos llamar?",
  },
  GENDER_STEP,
  SOURCE_STEP,
  {
    id: "clinic-name",
    faceId: "03_verde_morado",
    title: "¿Cómo se llama vuestro centro?",
  },
  {
    id: "avatar",
    faceId: "05_rosa_verde",
    title: "Elige tu cara",
  },
  PROFESSIONAL_ACCOUNT_STEP,
];

export const ONBOARDING_STEPS: Record<OnboardingRole, readonly OnboardingStep[]> = {
  patient: PATIENT_STEPS,
  psychologist: PSYCHOLOGIST_STEPS,
  clinic: CLINIC_STEPS,
};
