import { AlertTriangle, Link2Off, UserCheck, UserRoundCheck } from "lucide-react";

import { ConnectRequestCard } from "@/components/invitations/connect-request-card";
import { ConnectStatusCard } from "@/components/invitations/connect-status-card";
import {
  getConnectionRequestForPair,
  getInviteLinkByToken,
  getPatientPsychologist,
  getProfileById,
} from "@/server/queries";

type ConnectPageContentProps = {
  profileId: string;
  role: "patient" | "psychologist" | "admin" | null;
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
        title="Enlace no encontrado"
        description="Pide a tu profesional que te comparta de nuevo su enlace de invitación."
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
        title="Enlace inválido"
        description="Este enlace de invitación ya no es válido. Pide a tu profesional que te comparta uno nuevo."
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
        description="Este enlace de invitación solo puede usarlo una cuenta de paciente."
        href="/"
        hrefLabel="Ir al inicio"
      />
    );
  }

  const existingLink = await getPatientPsychologist(profileId);

  if (existingLink) {
    return (
      <ConnectStatusCard
        icon={UserRoundCheck}
        title="Ya estás vinculado"
        description="Ya tienes un psicólogo/a asignado. Desvincúlate desde tu perfil si quieres conectar con otro profesional."
        href="/perfil"
        hrefLabel="Ir a mi perfil"
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
        title="Solicitud pendiente"
        description="Ya has enviado una solicitud de conexión. Espera a que tu profesional la acepte."
        href="/perfil"
        hrefLabel="Ir a mi perfil"
      />
    );
  }

  const psychologist = await getProfileById(link.psychologistId);

  if (!psychologist) {
    return (
      <ConnectStatusCard
        icon={AlertTriangle}
        title="Enlace inválido"
        description="Este enlace de invitación ya no es válido. Pide a tu profesional que te comparta uno nuevo."
        href="/"
        hrefLabel="Ir al inicio"
      />
    );
  }

  return <ConnectRequestCard psychologist={psychologist} />;
}
