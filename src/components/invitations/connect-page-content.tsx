import { AlertTriangle } from "lucide-react";

import { ConnectExistingPsychologist } from "@/components/invitations/connect-existing-psychologist";
import { ConnectCodeCard } from "@/components/invitations/connect-code-card";
import { ConnectConfirmCard } from "@/components/invitations/connect-confirm-card";
import { ConnectStatusCard } from "@/components/invitations/connect-status-card";
import type { UserRole } from "@/db/schema";
import {
  getInviteLinkByToken,
  getPatientPsychologist,
  getProfileById,
} from "@/server/queries";

type ConnectPageContentProps = {
  profileId: string;
  role: UserRole | null;
  token: string | undefined;
};

export async function ConnectPageContent({
  profileId,
  role,
  token,
}: ConnectPageContentProps) {
  if (role !== "patient") {
    return (
      <ConnectStatusCard
        icon={AlertTriangle}
        title="Enlace solo para pacientes"
        description="Este enlace es para cuentas de paciente."
        href="/"
        hrefLabel="Ir al inicio"
      />
    );
  }

  if (!token) {
    return <ConnectCodeCard />;
  }

  const link = await getInviteLinkByToken(token);

  if (!link) {
    return <ConnectCodeCard expired />;
  }

  const [existingLink, psychologist] = await Promise.all([
    getPatientPsychologist(profileId),
    getProfileById(link.psychologistId),
  ]);

  if (existingLink && psychologist) {
    return (
      <ConnectExistingPsychologist
        currentPsychologist={existingLink}
        invitingPsychologist={psychologist}
        isSamePsychologist={existingLink.psychologistId === psychologist.id}
      />
    );
  }

  if (!psychologist) {
    return (
      <ConnectStatusCard
        icon={AlertTriangle}
        title="Este enlace ya no funciona"
        description="Pide a tu psicólogo/a que te mande uno nuevo."
        href="/"
        hrefLabel="Ir al inicio"
      />
    );
  }

  return <ConnectConfirmCard psychologist={psychologist} />;
}
