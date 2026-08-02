import type { RecordEmotion } from "@/db/schema";
import { getEmotionColor } from "@/lib/emotions";

type RecordEmotionRowProps = {
  emotion: RecordEmotion;
};

export function RecordEmotionRow({ emotion }: RecordEmotionRowProps) {
  const colors = getEmotionColor(emotion.emotion);
  const percentage = Math.min(Math.max(emotion.intensity, 0), 10) * 10;

  return (
    <div
      className="space-y-3 rounded-xl p-4"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span
          className="min-w-0 truncate text-sm font-semibold"
          style={{ color: colors.text }}
        >
          {emotion.emotion}
        </span>
        <span className="text-sm font-bold" style={{ color: colors.text }}>
          {emotion.intensity}
          <span className="font-medium opacity-70">/10</span>
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-card/75"
        role="progressbar"
        aria-label={`Intensidad de ${emotion.emotion}`}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={emotion.intensity}
      >
        <div
          className="h-full rounded-full"
          style={{ backgroundColor: colors.text, width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
