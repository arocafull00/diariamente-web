import { RecordEmotionRow } from "@/components/records/record-emotion-row";
import type { GrammaticalGender, RecordEmotion } from "@/db/schema";

type RecordEmotionsSectionProps = {
  emotions: RecordEmotion[];
  gender: GrammaticalGender;
};

export function RecordEmotionsSection({
  emotions,
  gender,
}: RecordEmotionsSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="px-1 font-display text-xl font-medium">Emociones</h2>
      <div className="space-y-2">
        {emotions.map((emotion) => (
          <RecordEmotionRow
            key={emotion.emotion}
            emotion={emotion}
            gender={gender}
          />
        ))}
      </div>
    </section>
  );
}
