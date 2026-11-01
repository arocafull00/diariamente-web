import { Building2 } from "lucide-react";

import { ProfileStatCard } from "./profile-stat-card";

type ProfileClinicTeamCardProps = {
  clinicName: string;
  psychologistCount: number;
};

export function ProfileClinicTeamCard({
  clinicName,
  psychologistCount,
}: ProfileClinicTeamCardProps) {
  return (
    <ProfileStatCard
      href="/clinica"
      title={clinicName}
      label={
        psychologistCount === 1
          ? "psicólogo/a en el equipo"
          : "psicólogos/as en el equipo"
      }
      value={psychologistCount}
      icon={Building2}
    />
  );
}
