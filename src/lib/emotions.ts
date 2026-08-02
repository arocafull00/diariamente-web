export const PREDEFINED_EMOTIONS = [
  "Alegría",
  "Tristeza",
  "Miedo",
  "Rabia",
  "Asco",
  "Ansiedad",
] as const;

export type PredefinedEmotion = (typeof PREDEFINED_EMOTIONS)[number];

export const EMOTION_COLORS: Record<string, { bg: string; text: string }> = {
  Alegría: { bg: "#fef9c3", text: "#854d0e" },
  Tristeza: { bg: "#dbeafe", text: "#1e40af" },
  Miedo: { bg: "#e8dfff", text: "#5b21b6" },
  Rabia: { bg: "#fec9c8", text: "#991b1b" },
  Asco: { bg: "#dcfce7", text: "#166534" },
  Ansiedad: { bg: "#ffedd5", text: "#9a3412" },
};

export function getEmotionColor(emotion: string) {
  return (
    EMOTION_COLORS[emotion] ?? { bg: "#f4f3fe", text: "#7c3aed" }
  );
}
