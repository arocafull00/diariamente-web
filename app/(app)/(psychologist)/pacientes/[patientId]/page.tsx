import Link from "next/link";

import { AppHeader } from "@/components/app-shell/app-header";
import { RecordCard } from "@/components/records/record-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { requirePatientRelationship } from "@/server/auth/require-patient-relationship";
import { getPatientRecords } from "@/server/queries";
import { getFullName, getInitials } from "@/lib/utils-app";

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

  return (
    <>
      <AppHeader title={getFullName(patient.firstName, patient.lastName)} backHref="/pacientes" />
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-14">
            {patient.avatarUrl ? (
              <AvatarImage src={patient.avatarUrl} alt="" />
            ) : null}
            <AvatarFallback>
              {getInitials(patient.firstName, patient.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">
              {getFullName(patient.firstName, patient.lastName)}
            </p>
            <p className="text-sm text-muted-foreground">
              {records.length}{" "}
              {records.length === 1 ? "registro" : "registros"}
            </p>
          </div>
        </div>

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
