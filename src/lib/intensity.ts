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

  if (intensity < 7) {
    return "MEDIUM";
  }

  return "HIGH";
}
