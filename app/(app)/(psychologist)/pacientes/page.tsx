import { headers } from "next/headers";

import { AppHeader } from "@/components/app-shell/app-header";
import { FaceRow } from "@/components/faces/face-row";
import { InvitationsSheet } from "@/components/invitations/invitations-sheet";
import { PatientList } from "@/components/patients/patient-list";
import { PsychologistLiveSignals } from "@/components/realtime/psychologist-live-signals";
import { RealtimeSignalsProvider } from "@/components/realtime/realtime-signals-provider";
import { requireRole } from "@/server/auth/get-current-profile";
import {
  getInviteLink,
  getPendingConnectionRequests,
  getPsychologistPatients,
} from "@/server/queries";
import { sealPsychologistSignals } from "@/server/realtime/psychologist-signals";

export default async function PatientsPage() {
  const profile = await requireRole("psychologist");
  const [patients, inviteLink, requests, headersList, signals] =
    await Promise.all([
      getPsychologistPatients(profile.id),
      getInviteLink(profile.id),
      getPendingConnectionRequests(profile.id),
      headers(),
      sealPsychologistSignals(profile.id),
    ]);

  const host = headersList.get("host") ?? "";
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  const origin = `${protocol}://${host}`;

  return (
    <>
      {signals ? (
        <RealtimeSignalsProvider>
          <PsychologistLiveSignals {...signals} />
        </RealtimeSignalsProvider>
      ) : null}
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
      {patients.length === 0 ? (
        <div className="rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60">
          <div className="mb-5">
            <FaceRow faceIds={["02_azul_rosa", "alegria", "05_rosa_verde"]} />
          </div>
          <p className="text-sm text-muted-foreground">
            Aún no tienes pacientes. ¡Invita al primero!
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
        <PatientList patients={patients} />
      )}
      <InvitationsSheet
        token={inviteLink?.token ?? null}
        origin={origin}
        requests={requests}
        variant="floating"
      />
    </>
  );
}
