import type { GrammaticalGender, PatientRecord } from "@/db/schema";
import { getContextTagLabel, getContextTags } from "@/lib/context-tags";
import {
  getEmotionLabel,
  getQuadrantLabel,
  getRecordQuadrant,
} from "@/lib/emotions";
import { formatRecordDate } from "@/lib/utils-app";

import { DataExportField } from "./data-export-field";

type DataExportRecordProps = {
  record: PatientRecord;
  gender: GrammaticalGender;
};

export function DataExportRecord({ record, gender }: DataExportRecordProps) {
  const quadrant = getRecordQuadrant(record);
  const emotions = record.emotions
    .map(
      (item) => `${getEmotionLabel(item.emotion, gender)} (${item.intensity}/10)`,
    )
    .join(", ");
  const context = getContextTags(record.context)
    .map((tag) => getContextTagLabel(tag, gender))
    .join(", ");

  return (
    <article className="space-y-2 rounded-2xl border border-border/60 p-4 break-inside-avoid">
      <h3 className="font-semibold">{formatRecordDate(record.occurredAt)}</h3>
      <dl className="space-y-1.5">
        <DataExportField
          label="Estado de ánimo"
          value={quadrant ? getQuadrantLabel(quadrant) : ""}
        />
        <DataExportField label="Emociones" value={emotions} />
        <DataExportField label="Contexto" value={context} />
        <DataExportField
          label="Sensaciones corporales"
          value={
            record.bodySensations.length > 0
              ? String(record.bodySensations.length)
              : ""
          }
        />
        <DataExportField label="Situación" value={record.situation} />
        <DataExportField label="Pensamientos" value={record.thoughts} />
        <DataExportField label="Conductas" value={record.behaviours} />
      </dl>
    </article>
  );
}
