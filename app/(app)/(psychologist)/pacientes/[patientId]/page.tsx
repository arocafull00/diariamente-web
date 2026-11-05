import { PatientDetailHeader } from "@/components/patients/patient-detail-header";
import { PatientRecordsSection } from "@/components/patients/patient-records-section";
import { PatientSessionSummary } from "@/components/patients/patient-session-summary";
import { PsychologistLiveSignals } from "@/components/realtime/psychologist-live-signals";
import { RealtimeSignalsProvider } from "@/components/realtime/realtime-signals-provider";
import { RecordMoodOverview } from "@/components/records/record-mood-overview";
import { requirePatientRelationship } from "@/server/auth/require-patient-relationship";
import {
  getLastTherapySession,
  getPatientRecordSummaries,
  getPatientRecordsPageForPsychologist,
  getUnseenRecordCountForPatient,
} from "@/server/queries";
import { sealPsychologistSignals } from "@/server/realtime/psychologist-signals";
import { logger } from "@/lib/logger";
import { getRecordEmotionOptions } from "@/lib/record-filters";
import { getFullName } from "@/lib/utils-app";
import { recordFiltersSchema } from "@/validation/schemas";

type PatientDetailPageProps = {
  params: Promise<{ patientId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PatientDetailPage({
  params,
  searchParams,
}: PatientDetailPageProps) {
  const [{ patientId }, query] = await Promise.all([params, searchParams]);
  const result = await requirePatientRelationship(patientId);

  if (!("patient" in result)) {
    return null;
  }

  const { profile, patient } = result;
  const { emocion, desde, hasta, pagina } = recordFiltersSchema.parse(query);
  const filters = { emotions: emocion, from: desde, to: hasta, page: pagina };
  const [summaries, recordsPage, lastSession, unseenCount, signals] =
    await Promise.all([
      getPatientRecordSummaries(patientId),
      getPatientRecordsPageForPsychologist(patientId, profile.id, filters),
      getLastTherapySession(profile.id, patientId),
      getUnseenRecordCountForPatient(profile.id, patientId),
      sealPsychologistSignals(profile.id),
    ]).catch((error: unknown) => {
    logger.error("records.fetch_patient_failed", error, {
      patientId,
      psychologistId: profile.id,
    });
    throw error;
  });
  const patientName = getFullName(patient.firstName, patient.lastName);
  const lastActivityAt = summaries[0]?.occurredAt ?? null;

  return (
    <>
      {signals ? (
        <RealtimeSignalsProvider>
          <PsychologistLiveSignals {...signals} />
        </RealtimeSignalsProvider>
      ) : null}
      <PatientDetailHeader
        patientId={patientId}
        firstName={patient.firstName}
        lastName={patient.lastName}
        avatarUrl={patient.avatarUrl}
        lastActivityAt={lastActivityAt}
      />
      <div className="space-y-6">
        <RecordMoodOverview title="Balance emocional" records={summaries} />

        <PatientSessionSummary
          patientId={patientId}
          patientName={patientName}
          gender={patient.grammaticalGender}
          lastSessionAt={lastSession?.heldAt ?? null}
          records={summaries}
        />

        {summaries.length === 0 ? (
          <div className="rounded-3xl bg-card p-8 text-center text-sm text-muted-foreground shadow-sm ring-1 ring-border/60">
            Aún no hay registros por aquí. Aparecerán en cuanto empiece a escribir.
          </div>
        ) : (
          <PatientRecordsSection
            patientId={patientId}
            gender={patient.grammaticalGender}
            filters={{ ...filters, page: recordsPage.page }}
            emotionOptions={getRecordEmotionOptions(summaries)}
            records={recordsPage.records}
            total={recordsPage.total}
            pageCount={recordsPage.pageCount}
            lastSessionAt={lastSession?.heldAt ?? null}
            unseenCount={unseenCount}
          />
        )}
      </div>
    </>
  );
}
