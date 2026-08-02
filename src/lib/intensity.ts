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

export const INTENSITY_STYLES: Record<
  EmotionIntensity,
  {
    accent: string;
    badge: string;
    panel: string;
    text: string;
  }
> = {
  LOW: {
    accent: "bg-intensity-low-accent",
    badge: "bg-intensity-low text-intensity-low-foreground",
    panel: "bg-intensity-low",
    text: "text-intensity-low-foreground",
  },
  MEDIUM: {
    accent: "bg-intensity-medium-accent",
    badge: "bg-intensity-medium text-intensity-medium-foreground",
    panel: "bg-intensity-medium",
    text: "text-intensity-medium-foreground",
  },
  HIGH: {
    accent: "bg-intensity-high-accent",
    badge: "bg-intensity-high text-intensity-high-foreground",
    panel: "bg-intensity-high",
    text: "text-intensity-high-foreground",
  },
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
