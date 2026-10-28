import { PatientDetailHeader } from "@/components/patients/patient-detail-header";
import { PatientSessionSummary } from "@/components/patients/patient-session-summary";
import { PatientUnlinkButton } from "@/components/patients/patient-unlink-button";
import { RecordMoodOverview } from "@/components/records/record-mood-overview";
import { RecordTimeline } from "@/components/records/record-timeline";
import { requirePatientRelationship } from "@/server/auth/require-patient-relationship";
import {
  getLastTherapySession,
  getPatientRecordsForPsychologist,
} from "@/server/queries";
import { logger } from "@/lib/logger";
import { getFullName } from "@/lib/utils-app";

type PatientDetailPageProps = {
  params: Promise<{ patientId: string }>;
};

export default async function PatientDetailPage({
  params,
}: PatientDetailPageProps) {
  const { patientId } = await params;
  const result = await requirePatientRelationship(patientId);

  if (!("patient" in result)) {
    return null;
  }

  const { profile, patient } = result;
  const [records, lastSession] = await Promise.all([
    getPatientRecordsForPsychologist(patientId, profile.id),
    getLastTherapySession(profile.id, patientId),
  ]).catch((error: unknown) => {
    logger.error("records.fetch_patient_failed", error, {
      patientId,
      psychologistId: profile.id,
    });
    throw error;
  });
  const patientName = getFullName(patient.firstName, patient.lastName);
  const lastActivityAt = records[0]?.occurredAt ?? null;

  return (
    <>
      <PatientDetailHeader
        patientId={patientId}
        firstName={patient.firstName}
        lastName={patient.lastName}
        avatarUrl={patient.avatarUrl}
        recordCount={records.length}
        lastActivityAt={lastActivityAt}
      />
      <div className="space-y-6">
        <PatientSessionSummary
          patientId={patientId}
          patientName={patientName}
          gender={patient.grammaticalGender}
          lastSessionAt={lastSession?.heldAt ?? null}
          records={records}
        />

        {records.length === 0 ? (
          <div className="rounded-3xl bg-card p-8 text-center text-sm text-muted-foreground shadow-sm ring-1 ring-border/60">
            Este paciente aún no tiene registros.
          </div>
        ) : (
          <>
            <RecordMoodOverview title="Balance emocional" records={records} />
            <RecordTimeline
              records={records}
              gender={patient.grammaticalGender}
              showUnseen
            />
          </>
        )}

        <PatientUnlinkButton
          patientId={patientId}
          patientName={patientName}
          layout="footer"
        />
      </div>
    </>
  );
}
