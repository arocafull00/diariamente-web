import { HeartPulse } from "lucide-react";

import { RecordEmotionRow } from "@/components/records/record-emotion-row";
import type { RecordEmotion } from "@/db/schema";

type RecordEmotionsSectionProps = {
  emotions: RecordEmotion[];
};

export function RecordEmotionsSection({
  emotions,
}: RecordEmotionsSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
          <HeartPulse className="size-4" aria-hidden="true" />
        </span>
        <h2 className="text-sm font-semibold">Emociones</h2>
      </div>
      <div className="space-y-2">
        {emotions.map((emotion) => (
          <RecordEmotionRow key={emotion.emotion} emotion={emotion} />
        ))}
      </div>
    </section>
  );
}
