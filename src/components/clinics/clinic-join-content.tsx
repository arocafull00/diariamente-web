import { AlertTriangle, Link2Off } from "lucide-react";

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
        title="Este enlace no existe"
        description="Pide a tu clínica que te lo vuelva a enviar."
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
        title="Este enlace ya no funciona"
        description="Pide a tu clínica que te mande uno nuevo."
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
        description="Este enlace es para cuentas de psicólogo/a."
        href="/"
        hrefLabel="Ir al inicio"
      />
    );
  }

  const currentClinic = await getPsychologistClinic(profileId);

  if (currentClinic) {
    return (
      <ConnectStatusCard
        icon="equipo"
        title="¡Ya tienes clínica!"
        description={`Formas parte de ${currentClinic.name}. Si quieres unirte a otra, sal antes desde tu perfil.`}
        href="/perfil"
        hrefLabel="Ir a mi perfil"
      />
    );
  }

  return <ClinicJoinCard clinicName={link.clinicName} />;
}
