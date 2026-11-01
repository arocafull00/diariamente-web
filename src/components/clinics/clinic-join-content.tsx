import { AlertTriangle, Building2, Link2Off } from "lucide-react";

import { ConnectStatusCard } from "@/components/invitations/connect-status-card";
import type { UserRole } from "@/db/schema";
import {
  getClinicInviteLinkByToken,
  getPsychologistClinic,
} from "@/server/queries";

import { ClinicJoinCard } from "./clinic-join-card";

type ClinicJoinContentProps = {
  profileId: string;
  role: UserRole | null;
  token: string | undefined;
};

export async function ClinicJoinContent({
  profileId,
  role,
  token,
}: ClinicJoinContentProps) {
  if (!token) {
    return (
      <ConnectStatusCard
        icon={Link2Off}
        title="Enlace no encontrado"
        description="Pide a tu clínica que te comparta de nuevo su enlace de invitación."
        href="/"
        hrefLabel="Ir al inicio"
      />
    );
  }

  const link = await getClinicInviteLinkByToken(token);

  if (!link) {
    return (
      <ConnectStatusCard
        icon={AlertTriangle}
        title="Enlace inválido"
        description="Este enlace de invitación ya no es válido. Pide a tu clínica que te comparta uno nuevo."
        href="/"
        hrefLabel="Ir al inicio"
      />
    );
  }

  if (role !== "psychologist") {
    return (
      <ConnectStatusCard
        icon={AlertTriangle}
        title="Enlace solo para profesionales"
        description="Este enlace solo puede usarlo una cuenta de psicólogo/a."
        href="/"
        hrefLabel="Ir al inicio"
      />
    );
  }

  const currentClinic = await getPsychologistClinic(profileId);

  if (currentClinic) {
    return (
      <ConnectStatusCard
        icon={Building2}
        title="Ya perteneces a una clínica"
        description={`Formas parte de ${currentClinic.name}. Sal de ella desde tu perfil si quieres unirte a otra.`}
        href="/perfil"
        hrefLabel="Ir a mi perfil"
      />
    );
  }

  return <ClinicJoinCard clinicName={link.clinicName} />;
}
