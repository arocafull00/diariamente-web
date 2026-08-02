import type { EmotionIntensity, RecordEmotion } from "@/db/schema";

export function getRecordIntensity(
  emotions: Pick<RecordEmotion, "intensity">[],
): EmotionIntensity {
  if (emotions.length === 0) {
    return "LOW";
  }

  const totalIntensity = emotions.reduce(
    (acc, emotion) => acc + emotion.intensity,
    0,
  );
  const intensity = Math.floor(totalIntensity / emotions.length);

  if (intensity < 3) {
    return "LOW";
  }

  if (intensity < 6) {
    return "MEDIUM";
  }

  return "HIGH";
}

export const INTENSITY_BADGE_COLORS: Record<
  EmotionIntensity,
  { bg: string; text: string }
> = {
  LOW: { bg: "#dbfce7", text: "#166534" },
  MEDIUM: { bg: "#fff9c3", text: "#854d0e" },
  HIGH: { bg: "#fec9c8", text: "#991b1b" },
};

export function formatIntensity(intensity: EmotionIntensity) {
  if (intensity === "LOW") {
    return "Baja";
  }

  if (intensity === "MEDIUM") {
    return "Media";
  }

  return "Alta";
}
