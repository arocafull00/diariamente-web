import Link from "next/link";

import { PatientDetailHeader } from "@/components/patients/patient-detail-header";
import { PatientUnlinkButton } from "@/components/patients/patient-unlink-button";
import { RecordCard } from "@/components/records/record-card";
import { requirePatientRelationship } from "@/server/auth/require-patient-relationship";
import { getPatientRecords } from "@/server/queries";
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

  const { patient } = result;
  const records = await getPatientRecords(patientId);
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
      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="rounded-lg bg-secondary p-6 text-center text-sm text-muted-foreground">
            Este paciente aún no tiene registros.
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                href={`/registro/${record.id}`}
                showUnseen
              />
            ))}
          </div>
        )}

        <PatientUnlinkButton
          patientId={patientId}
          patientName={patientName}
          layout="footer"
        />

        <Link
          href="/pacientes"
          className="block text-center text-sm font-medium text-primary"
        >
          Volver a pacientes
        </Link>
      </div>
    </>
  );
}
