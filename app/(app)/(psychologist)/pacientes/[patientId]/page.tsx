import { PatientDetailHeader } from "@/components/patients/patient-detail-header";
import { PatientUnlinkButton } from "@/components/patients/patient-unlink-button";
import { RecordMoodOverview } from "@/components/records/record-mood-overview";
import { RecordTimeline } from "@/components/records/record-timeline";
import { requirePatientRelationship } from "@/server/auth/require-patient-relationship";
import { getPatientRecordsForPsychologist } from "@/server/queries";
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
  const records = await getPatientRecordsForPsychologist(
    patientId,
    profile.id,
  );
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
        {records.length === 0 ? (
          <div className="rounded-3xl bg-card p-8 text-center text-sm text-muted-foreground shadow-sm ring-1 ring-border/60">
            Este paciente aún no tiene registros.
          </div>
        ) : (
          <>
            <RecordMoodOverview title="Balance emocional" records={records} />
            <RecordTimeline records={records} showUnseen />
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
