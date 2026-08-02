import Link from "next/link";

import { AppHeader } from "@/components/app-shell/app-header";
import { PatientCard } from "@/components/patients/patient-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requireRole } from "@/server/auth/get-current-profile";
import { getPsychologistPatients } from "@/server/queries";

export default async function PatientsPage() {
  const profile = await requireRole("psychologist");
  const patients = await getPsychologistPatients(profile.id);

  return (
    <>
      <AppHeader title="Pacientes" />
      <div className="space-y-3">
        {patients.length === 0 ? (
          <div className="rounded-lg bg-secondary p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Aún no tienes pacientes vinculados.
            </p>
            <Link href="/invitacion" className={cn(buttonVariants(), "mt-4")}>
              Invitar paciente
            </Link>
          </div>
        ) : (
          patients.map((patient) => (
            <PatientCard
              key={patient.id}
              id={patient.id}
              firstName={patient.firstName}
              lastName={patient.lastName}
              avatarUrl={patient.avatarUrl}
              unseenCount={patient.unseenCount}
            />
          ))
        )}
      </div>
    </>
  );
}
