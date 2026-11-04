import { AlertTriangle, Link2Off, UserCheck } from "lucide-react";

import { ConnectExistingPsychologist } from "@/components/invitations/connect-existing-psychologist";
import { ConnectRequestCard } from "@/components/invitations/connect-request-card";
import { ConnectStatusCard } from "@/components/invitations/connect-status-card";
import type { UserRole } from "@/db/schema";
import {
  getConnectionRequestForPair,
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
  if (!token) {
    return (
      <ConnectStatusCard
        icon={Link2Off}
        title="Este enlace no existe"
        description="Pide a tu psicólogo/a que te lo vuelva a enviar."
        href="/"
        hrefLabel="Ir al inicio"
      />
    );
  }

  const link = await getInviteLinkByToken(token);

  if (!link) {
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

  const pendingRequest = await getConnectionRequestForPair(
    profileId,
    link.psychologistId,
  );

  if (pendingRequest?.status === "pending") {
    return (
      <ConnectStatusCard
        icon={UserCheck}
        title="Tu solicitud está en camino"
        description="En cuanto tu psicólogo/a la acepte, estaréis conectados."
        href="/perfil"
        hrefLabel="Ir a mi perfil"
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

  return <ConnectRequestCard psychologist={psychologist} />;
}
