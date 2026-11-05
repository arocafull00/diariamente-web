import { PatientSessionContextItem } from "@/components/patients/patient-session-context-item";
import { PatientSessionEmotionItem } from "@/components/patients/patient-session-emotion-item";
import { PatientSessionPeakItem } from "@/components/patients/patient-session-peak-item";
import { PatientSessionSummaryBlock } from "@/components/patients/patient-session-summary-block";
import type { GrammaticalGender } from "@/db/schema";
import type { getSessionSummary } from "@/lib/session-summary";

type PatientSessionSummaryDetailsProps = {
  patientId: string;
  summary: ReturnType<typeof getSessionSummary>;
  gender: GrammaticalGender;
};

export function PatientSessionSummaryDetails({
  patientId,
  summary,
  gender,
}: PatientSessionSummaryDetailsProps) {
  return (
    <>
      {summary.topEmotions.length > 0 ? (
        <PatientSessionSummaryBlock title="Emociones más frecuentes">
          <ul className="space-y-0.5">
            {summary.topEmotions.map((item) => (
              <PatientSessionEmotionItem
                key={item.name}
                patientId={patientId}
                emotion={item.name}
                count={item.count}
                gender={gender}
              />
            ))}
          </ul>
        </PatientSessionSummaryBlock>
      ) : null}

      {summary.peaks.length > 0 ? (
        <PatientSessionSummaryBlock title="Picos de intensidad">
          <ul className="space-y-0.5">
            {summary.peaks.map((peak) => (
              <PatientSessionPeakItem
                key={peak.id}
                recordId={peak.id}
                emotion={peak.emotion}
                occurredAt={peak.occurredAt}
                gender={gender}
              />
            ))}
          </ul>
        </PatientSessionSummaryBlock>
      ) : null}

      {summary.repeatedContexts.length > 0 ? (
        <PatientSessionSummaryBlock title="Contextos que se repiten">
          <ul className="flex flex-wrap gap-1.5">
            {summary.repeatedContexts.map((item) => (
              <PatientSessionContextItem
                key={item.name}
                tag={item.name}
                count={item.count}
                gender={gender}
              />
            ))}
          </ul>
        </PatientSessionSummaryBlock>
      ) : null}
    </>
  );
}
