import type { FaceId } from "@/lib/faces";

export type WelcomeTone = "hp" | "lu" | "hu" | "lp";

export type WelcomeFeature = {
  faceId: FaceId;
  title: string;
  description: string;
};

export type WelcomeGoal = {
  id: string;
  faceId: FaceId;
  tone: WelcomeTone;
  label: string;
  replyTitle: string;
  replyDescription: string;
};

export type WelcomeStepId =
  | "hello"
  | "goal"
  | "goal-reply"
  | "features"
  | "emotions"
  | "privacy"
  | "safe-space"
  | "notifications"
  | "invite"
  | "install"
  | "ready";

export type WelcomeStep = {
  id: WelcomeStepId;
  faceId: FaceId;
  title: string;
  description: string;
  features?: readonly WelcomeFeature[];
  faceRow?: readonly FaceId[];
};

export type WelcomeFlow = {
  steps: readonly WelcomeStep[];
  goals: readonly WelcomeGoal[];
};

const NO_CLINICAL_PUSH: WelcomeFeature = {
  faceId: "02_azul_rosa",
  title: "Avisos sin datos clínicos",
  description: "Las notificaciones nunca muestran el contenido de los registros.",
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

const GOAL_REPLY_STEP: WelcomeStep = {
  id: "goal-reply",
  faceId: "alegria",
  title: "",
  description: "",
};

const PATIENT_FLOW: WelcomeFlow = {
  steps: [
    {
      id: "hello",
      faceId: "alegria",
      title: "¡Hola, {name}! Soy tu diario emocional",
      description:
        "Te acompaño entre sesión y sesión para que entiendas mejor lo que sientes. Solo te llevará un minuto conocerme.",
    },
    {
      id: "goal",
      faceId: "01_gradiente",
      title: "¿Qué te trae por aquí?",
      description: "Elige lo que más se parezca a lo que buscas.",
    },
    GOAL_REPLY_STEP,
    {
      id: "emotions",
      faceId: "05_rosa_verde",
      title: "Todas las emociones cuentan",
      description:
        "No hay emociones buenas ni malas. Ponerles nombre es el primer paso para entender qué te pasa y por qué.",
      faceRow: ["alegria", "tristeza", "ansiedad", "rabia"],
    },
    {
      id: "features",
      faceId: "02_azul_rosa",
      title: "Así es un registro",
      description:
        "Se basa en la terapia cognitivo-conductual y se completa en unos pocos minutos.",
      features: [
        {
          faceId: "alegria",
          title: "Cómo te sientes",
          description: "Elige una emoción y su intensidad.",
        },
        {
          faceId: "02_azul_rosa",
          title: "En qué contexto",
          description: "Marca dónde estabas o con quién.",
        },
        {
          faceId: "05_rosa_verde",
          title: "Dónde lo notas",
          description: "Señala las sensaciones en tu cuerpo.",
        },
        {
          faceId: "03_verde_morado",
          title: "Profundiza",
          description: "Describe la situación, lo que pensaste y lo que hiciste.",
        },
      ],
    },
    {
      id: "safe-space",
      faceId: "03_verde_morado",
      title: "Este es tu espacio seguro",
      description:
        "Escribe con total sinceridad: aquí no hay respuestas correctas ni nadie que te juzgue.",
    },
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
        "Cuando pase algo que te remueva, abre Diariamente y cuéntamelo. Estaré aquí.",
      faceRow: CELEBRATION_FACES,
    },
  ],
  goals: [
    {
      id: "understand",
      faceId: "alegria",
      tone: "hp",
      label: "Entender mejor mis emociones",
      replyTitle: "¡Me encanta! Vamos a ello",
      replyDescription:
        "Registrando lo que sientes descubrirás patrones que hoy pasan desapercibidos.",
    },
    {
      id: "therapy",
      faceId: "01_gradiente",
      tone: "lu",
      label: "Aprovechar más mis sesiones de terapia",
      replyTitle: "¡Buena idea!",
      replyDescription:
        "Llegarás a cada sesión con lo que has vivido anotado, sin depender de la memoria.",
    },
    {
      id: "anxiety",
      faceId: "ansiedad",
      tone: "hu",
      label: "Gestionar la ansiedad o el estrés",
      replyTitle: "Estás en buen lugar",
      replyDescription:
        "Identificar qué dispara tu ansiedad es el primer paso para manejarla mejor.",
    },
    {
      id: "vent",
      faceId: "tristeza",
      tone: "lp",
      label: "Desahogarme y ordenar mis ideas",
      replyTitle: "Aquí puedes soltarlo todo",
      replyDescription:
        "Escribir lo que te pasa ayuda a verlo con más distancia y claridad.",
    },
  ],
};

const PSYCHOLOGIST_FLOW: WelcomeFlow = {
  steps: [
    {
      id: "hello",
      faceId: "alegria",
      title: "¡Hola, {name}! Encantados de conocerte",
      description:
        "Diariamente te ayuda a acompañar a tus pacientes entre sesiones, con sus registros emocionales a mano.",
    },
    {
      id: "goal",
      faceId: "01_gradiente",
      title: "¿Qué te gustaría conseguir?",
      description: "Elige lo que más te interese ahora mismo.",
    },
    GOAL_REPLY_STEP,
    {
      id: "features",
      faceId: "02_azul_rosa",
      title: "Así trabajarás conmigo",
      description:
        "Tus pacientes registran lo que viven y tú lo consultas cuando lo necesites.",
      features: [
        {
          faceId: "alegria",
          title: "Tus pacientes en un lugar",
          description: "Consulta a quién acompañas y su último registro.",
        },
        {
          faceId: "02_azul_rosa",
          title: "Registros completos",
          description: "Emociones, contexto, sensaciones, pensamientos y conductas.",
        },
        {
          faceId: "04_naranja_amarillo",
          title: "Novedades de un vistazo",
          description: "Identifica los registros que aún no has revisado.",
        },
        {
          faceId: "03_verde_morado",
          title: "Tus notas",
          description: "Añade anotaciones privadas a cada registro.",
        },
      ],
    },
    {
      id: "privacy",
      faceId: "03_verde_morado",
      title: "Confidencialidad por diseño",
      description:
        "El acceso a la información clínica está siempre limitado y bajo control del paciente.",
      features: [
        {
          faceId: "01_gradiente",
          title: "Solo pacientes vinculados",
          description: "Accedes únicamente a quien ha aceptado conectar contigo.",
        },
        {
          faceId: "05_rosa_verde",
          title: "El paciente decide",
          description: "Puede desvincularse cuando quiera y dejarás de ver sus registros.",
        },
        NO_CLINICAL_PUSH,
      ],
    },
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
  ],
  goals: [
    {
      id: "context",
      faceId: "alegria",
      tone: "hp",
      label: "Llegar a cada sesión con más contexto",
      replyTitle: "¡Para eso estoy!",
      replyDescription:
        "Verás lo que ha vivido tu paciente durante la semana antes de empezar la sesión.",
    },
    {
      id: "homework",
      faceId: "01_gradiente",
      tone: "lu",
      label: "Que mis pacientes registren entre sesiones",
      replyTitle: "¡Lo haremos fácil!",
      replyDescription:
        "Recordatorios diarios y un registro guiado de pocos minutos ayudan a crear el hábito.",
    },
    {
      id: "progress",
      faceId: "05_rosa_verde",
      tone: "lp",
      label: "Seguir su evolución emocional",
      replyTitle: "¡Buena elección!",
      replyDescription:
        "Los registros muestran cómo cambian las emociones y su intensidad con el tiempo.",
    },
    {
      id: "time",
      faceId: "04_naranja_amarillo",
      tone: "hu",
      label: "Ahorrar tiempo recogiendo información",
      replyTitle: "¡Hecho!",
      replyDescription:
        "Los autorregistros llegan ordenados y listos para revisar, sin papeles.",
    },
  ],
};

export const WELCOME_FLOWS = {
  patient: PATIENT_FLOW,
  psychologist: PSYCHOLOGIST_FLOW,
} as const;
