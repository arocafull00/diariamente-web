import { headers } from "next/headers";

import { AppHeader } from "@/components/app-shell/app-header";
import { InvitationsSheet } from "@/components/invitations/invitations-sheet";
import { PatientCard } from "@/components/patients/patient-card";
import { requireRole } from "@/server/auth/get-current-profile";
import {
  getInviteLink,
  getPendingConnectionRequests,
  getPsychologistPatients,
} from "@/server/queries";

export default async function PatientsPage() {
  const profile = await requireRole("psychologist");
  const [patients, inviteLink, requests, headersList] = await Promise.all([
    getPsychologistPatients(profile.id),
    getInviteLink(profile.id),
    getPendingConnectionRequests(profile.id),
    headers(),
  ]);

  const host = headersList.get("host") ?? "";
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  const origin = `${protocol}://${host}`;

  return (
    <>
      <AppHeader
        title="Pacientes"
        action={
          <InvitationsSheet
            token={inviteLink?.token ?? null}
            origin={origin}
            requests={requests}
          />
        }
      />
      <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
        {patients.length === 0 ? (
          <div className="rounded-lg bg-secondary p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Aún no tienes pacientes vinculados.
            </p>
            <div className="mt-4 flex justify-center">
              <InvitationsSheet
                token={inviteLink?.token ?? null}
                origin={origin}
                requests={requests}
                variant="button"
              />
            </div>
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
