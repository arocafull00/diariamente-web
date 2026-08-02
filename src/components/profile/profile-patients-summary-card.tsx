import Link from "next/link";

import { ProfileSectionCard } from "./profile-section-card";

type ProfilePatientsSummaryCardProps = {
  patientCount: number;
};

export function ProfilePatientsSummaryCard({
  patientCount,
}: ProfilePatientsSummaryCardProps) {
  return (
    <Link href="/pacientes" className="block transition-opacity hover:opacity-90">
      <ProfileSectionCard title="Mis pacientes">
        <div className="flex items-end justify-between gap-4">
          <p className="text-sm text-muted-foreground">Total de pacientes:</p>
          <p className="text-3xl font-bold text-primary">{patientCount}</p>
        </div>
      </ProfileSectionCard>
    </Link>
  );
}
