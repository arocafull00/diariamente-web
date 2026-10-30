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
    "Tus ideas nos ayudan a hacer Diariamente mejor. Adjuntamos datos técnicos del dispositivo, nunca tus registros.",
  messagePlaceholder: "¿Qué cambiarías o qué te gustaría encontrar?",
  callLabel: "¿Te apetece una llamada de 15 minutos?",
  callDescription: "Te escribiremos para buscar un hueco.",
  success: "¡Gracias! Lo leeremos con calma.",
  promptTitle: "¡Llevas una buena racha!",
  promptQuestion: "¿Te está resultando fácil registrar cómo te sientes?",
  promptThanks: "¡Gracias por contárnoslo!",
  promptMore: "Contarnos más",
} as const;
