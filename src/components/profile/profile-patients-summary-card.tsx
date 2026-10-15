import { Users } from "lucide-react";

import { ProfileStatCard } from "./profile-stat-card";

type ProfilePatientsSummaryCardProps = {
  patientCount: number;
};

export function ProfilePatientsSummaryCard({
  patientCount,
}: ProfilePatientsSummaryCardProps) {
  return (
    <ProfileStatCard
      href="/pacientes"
      title="Mis pacientes"
      label={patientCount === 1 ? "paciente vinculado" : "pacientes vinculados"}
      value={patientCount}
      icon={Users}
    />
  );
}
