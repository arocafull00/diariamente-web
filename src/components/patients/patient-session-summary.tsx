import { PatientSessionButton } from "@/components/patients/patient-session-button";
import { PatientSessionContextItem } from "@/components/patients/patient-session-context-item";
import { PatientSessionEmotionItem } from "@/components/patients/patient-session-emotion-item";
import { PatientSessionPeakItem } from "@/components/patients/patient-session-peak-item";
import { PatientSessionSummaryBlock } from "@/components/patients/patient-session-summary-block";
import type { GrammaticalGender, PatientRecord } from "@/db/schema";
import { getSessionSummary } from "@/lib/session-summary";
import { formatLastActivityLabel } from "@/lib/utils-app";

type PatientSessionSummaryProps = {
  patientId: string;
  patientName: string;
  gender: GrammaticalGender;
  lastSessionAt: Date | null;
  records: Pick<
    PatientRecord,
    "id" | "occurredAt" | "createdAt" | "emotions" | "context"
  >[];
};

export function PatientSessionSummary({
  patientId,
  patientName,
  gender,
  lastSessionAt,
  records,
}: PatientSessionSummaryProps) {
  const summary = getSessionSummary(records, lastSessionAt);
  const recordLabel =
    summary.recordCount === 1 ? "registro nuevo" : "registros nuevos";

  return (
    <section className="space-y-5 rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border/60">
      <div>
        <h2 className="font-display text-xl font-medium">
          {lastSessionAt ? "Desde vuestra última sesión" : "Antes de la primera sesión"}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {lastSessionAt
            ? `Última sesión ${formatLastActivityLabel(lastSessionAt)}`
            : "Marca la sesión al terminarla para ver qué pasa entre sesiones"}
        </p>
      </div>

      <p className="flex items-baseline gap-2">
        <span className="text-3xl leading-none font-bold tracking-tight tabular-nums">
          {summary.recordCount}
        </span>
        <span className="text-sm text-muted-foreground">{recordLabel}</span>
      </p>

      {summary.recordCount > 0 ? (
        <div className="grid gap-5 sm:grid-cols-3">
          {summary.topEmotions.length > 0 ? (
            <PatientSessionSummaryBlock title="Emociones más frecuentes">
              <ul className="space-y-2">
                {summary.topEmotions.map((item) => (
                  <PatientSessionEmotionItem
                    key={item.name}
                    emotion={item.name}
                    count={item.count}
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
        </div>
      ) : null}

      <div className="border-t border-border pt-4">
        <PatientSessionButton patientId={patientId} patientName={patientName} />
      </div>
    </section>
  );
}
