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
      <h2 className="px-1 font-display text-xl font-medium">Emociones</h2>
      <div className="space-y-2">
        {emotions.map((emotion) => (
          <RecordEmotionRow key={emotion.emotion} emotion={emotion} />
        ))}
      </div>
    </section>
  );
}
