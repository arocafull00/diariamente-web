import {
  BellOff,
  BellRing,
  Brain,
  CalendarCheck,
  HeartPulse,
  Lock,
  MapPin,
  NotebookPen,
  NotebookText,
  PersonStanding,
  ShieldCheck,
  Smile,
  Trash2,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export type WelcomeFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type WelcomeStep = {
  id: "features" | "reminder" | "invite" | "install";
  label: string;
  title: string;
  description: string;
  features?: readonly WelcomeFeature[];
};

const INSTALL_STEP: WelcomeStep = {
  id: "install",
  label: "Instalar",
  title: "Lleva Diariamente contigo",
  description:
    "Añádela a tu pantalla de inicio para abrirla como una app, sin pasar por el navegador.",
};

const NO_CLINICAL_PUSH: WelcomeFeature = {
  icon: BellOff,
  title: "Avisos sin datos clínicos",
  description: "Las notificaciones nunca muestran el contenido de los registros.",
};

export const PATIENT_WELCOME_STEPS: readonly WelcomeStep[] = [
  {
    id: "features",
    label: "Bienvenida",
    title: "Así te acompaña Diariamente",
    description:
      "Un espacio para registrar lo que vives y entender cómo te afecta, de la mano de tu terapia.",
    features: [
      {
        icon: NotebookPen,
        title: "Registra lo que te pasa",
        description: "Anota situaciones, pensamientos y cómo reaccionaste.",
      },
      {
        icon: HeartPulse,
        title: "Pon nombre a tus emociones",
        description: "Elige lo que sientes, con qué intensidad y dónde lo notas.",
      },
      {
        icon: CalendarCheck,
        title: "Observa tu evolución",
        description: "Consulta tus registros y mantén tu racha día a día.",
      },
    ],
  },
  {
    id: "features",
    label: "Cómo funciona",
    title: "Así es un registro",
    description:
      "Basado en la terapia cognitivo-conductual y pensado para completarse en pocos minutos.",
    features: [
      {
        icon: Smile,
        title: "Cómo te sientes",
        description: "Elige una emoción y su intensidad.",
      },
      {
        icon: MapPin,
        title: "En qué contexto",
        description: "Marca dónde estabas o con quién.",
      },
      {
        icon: PersonStanding,
        title: "Dónde lo notas",
        description: "Señala las sensaciones en tu cuerpo.",
      },
      {
        icon: Brain,
        title: "Profundiza",
        description: "Describe la situación, lo que pensaste y lo que hiciste.",
      },
    ],
  },
  {
    id: "features",
    label: "Privacidad",
    title: "Tus registros son tuyos",
    description: "Tú decides quién puede verlos y durante cuánto tiempo.",
    features: [
      {
        icon: Lock,
        title: "Solo tú y tu profesional",
        description: "Únicamente tu psicólogo/a vinculado puede consultarlos.",
      },
      {
        icon: UserCheck,
        title: "Tú controlas la vinculación",
        description: "Puedes desvincularte cuando quieras desde tu perfil.",
      },
      NO_CLINICAL_PUSH,
      {
        icon: Trash2,
        title: "Borra tu cuenta cuando quieras",
        description: "Se eliminan todos tus datos de forma permanente.",
      },
    ],
  },
  {
    id: "reminder",
    label: "Recordatorio",
    title: "Un momento para ti cada día",
    description:
      "Te avisaremos a las 21:00 para que registres cómo ha ido tu día. Puedes cambiarlo en Ajustes.",
  },
  INSTALL_STEP,
];

export const PSYCHOLOGIST_WELCOME_STEPS: readonly WelcomeStep[] = [
  {
    id: "features",
    label: "Bienvenida",
    title: "Acompaña a tus pacientes entre sesiones",
    description:
      "Diariamente reúne los registros de tus pacientes para que llegues a cada sesión con contexto.",
    features: [
      {
        icon: Users,
        title: "Tus pacientes en un lugar",
        description: "Consulta a quién acompañas y su último registro.",
      },
      {
        icon: NotebookText,
        title: "Registros completos",
        description: "Emociones, contexto, sensaciones, pensamientos y conductas.",
      },
      {
        icon: BellRing,
        title: "Novedades de un vistazo",
        description: "Identifica los registros que aún no has revisado.",
      },
      {
        icon: NotebookPen,
        title: "Tus notas",
        description: "Añade anotaciones privadas a cada registro.",
      },
    ],
  },
  {
    id: "features",
    label: "Privacidad",
    title: "Confidencialidad por diseño",
    description: "El acceso a la información clínica está siempre limitado y bajo control del paciente.",
    features: [
      {
        icon: ShieldCheck,
        title: "Solo pacientes vinculados",
        description: "Accedes únicamente a quien ha aceptado conectar contigo.",
      },
      {
        icon: UserCheck,
        title: "El paciente decide",
        description: "Puede desvincularse cuando quiera y dejarás de ver sus registros.",
      },
      NO_CLINICAL_PUSH,
    ],
  },
  {
    id: "invite",
    label: "Invitar",
    title: "Invita a tu primer paciente",
    description:
      "Genera tu enlace y compártelo. Cuando tu paciente lo abra, recibirás una solicitud para aceptarla.",
  },
  INSTALL_STEP,
];
