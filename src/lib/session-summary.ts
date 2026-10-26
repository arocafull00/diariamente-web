import type { PatientRecord } from "@/db/schema";
import { getContextTags } from "@/lib/context-tags";
import { getDominantEmotion } from "@/lib/emotions";

const PEAK_INTENSITY = 7;
const MAX_EMOTIONS = 3;
const MAX_CONTEXTS = 5;
const MAX_PEAKS = 3;

type SummaryRecord = Pick<
  PatientRecord,
  "id" | "occurredAt" | "createdAt" | "emotions" | "context"
>;

function getTopCounts(values: string[][], limit: number, minCount: number) {
  const counts = new Map<string, number>();

  for (const recordValues of values) {
    for (const value of new Set(recordValues)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return Array.from(counts, ([name, count]) => ({ name, count }))
    .filter((item) => item.count >= minCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getSessionSummary(records: SummaryRecord[], since: Date | null) {
  const periodRecords = since
    ? records.filter((record) => record.createdAt > since)
    : records;

  const peaks = periodRecords
    .flatMap((record) => {
      const emotion = getDominantEmotion(record.emotions);

      if (!emotion || emotion.intensity < PEAK_INTENSITY) {
        return [];
      }

      return [{ id: record.id, occurredAt: record.occurredAt, emotion }];
    })
    .sort((a, b) => b.emotion.intensity - a.emotion.intensity)
    .slice(0, MAX_PEAKS);

  return {
    recordCount: periodRecords.length,
    topEmotions: getTopCounts(
      periodRecords.map((record) =>
        record.emotions.map((emotion) => emotion.emotion),
      ),
      MAX_EMOTIONS,
      1,
    ),
    repeatedContexts: getTopCounts(
      periodRecords.map((record) => getContextTags(record.context)),
      MAX_CONTEXTS,
      2,
    ),
    peaks,
  };
}
