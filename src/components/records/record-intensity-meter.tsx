import type { EmotionIntensity } from "@/db/schema";
import { INTENSITY_STYLES } from "@/lib/intensity";
import { cn } from "@/lib/utils";

type RecordIntensityMeterProps = {
  intensity: EmotionIntensity;
};

const INTENSITY_LEVELS: Record<EmotionIntensity, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

export function RecordIntensityMeter({
  intensity,
}: RecordIntensityMeterProps) {
  const activeLevel = INTENSITY_LEVELS[intensity];
  const styles = INTENSITY_STYLES[intensity];

  return (
    <div
      className="flex gap-1.5"
      role="meter"
      aria-label="Nivel de intensidad emocional"
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuenow={activeLevel}
    >
      {[1, 2, 3].map((level) => (
        <span
          key={level}
          className={cn(
            "h-1.5 flex-1 rounded-full",
            level <= activeLevel ? styles.accent : "bg-card/65",
          )}
        />
      ))}
    </div>
  );
}
