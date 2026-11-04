import type { FeedbackEase, FeedbackKind } from "@/db/schema";

export const FEEDBACK_KIND_OPTIONS: { value: FeedbackKind; label: string }[] = [
  { value: "idea", label: "Tengo una idea" },
  { value: "bug", label: "Algo no funciona" },
  { value: "other", label: "Otra cosa" },
];

export const FEEDBACK_EASE_OPTIONS: { value: FeedbackEase; label: string }[] = [
  { value: "easy", label: "Sí" },
  { value: "neutral", label: "Más o menos" },
  { value: "hard", label: "No mucho" },
];

export const FEEDBACK_COPY = {
  entryTitle: "Ayúdanos a mejorar",
  entryDescription: "Cuéntanos qué cambiarías o qué no funciona.",
  sheetTitle: "Te escuchamos",
  sheetDescription:
    "Tus ideas nos ayudan a mejorar Diariamente. Con tu mensaje nos llega info de tu dispositivo, nunca tus registros.",
  messagePlaceholder: "¿Qué cambiarías o qué te gustaría encontrar?",
  callLabel: "¿Te apetece una llamada de 15 minutos?",
  callDescription: "Te escribiremos para buscar un hueco.",
  success: "¡Gracias! Lo leeremos con calma.",
  promptTitle: "¡Gracias por seguir aquí!",
  promptQuestion: "¿Te está resultando fácil registrar cómo te sientes?",
  promptThanks: "¡Gracias por contárnoslo!",
  promptMore: "Contarnos más",
} as const;

export const PLAY_REVIEW_COPY = {
  eyebrow: "¿Nos echas una mano?",
  title: "Si DiariaMente te está ayudando, cuéntalo en Google Play",
  description: "Tu valoración hace que más gente nos encuentre. Es solo un minuto.",
  rate: "Valorar en Google Play",
  dismiss: "Ahora no",
} as const;
