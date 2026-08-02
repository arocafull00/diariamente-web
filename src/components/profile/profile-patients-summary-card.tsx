import Link from "next/link";

import { ProfileSectionCard } from "./profile-section-card";

type ProfilePatientsSummaryCardProps = {
  patientCount: number;
};

export function ProfilePatientsSummaryCard({
  patientCount,
}: ProfilePatientsSummaryCardProps) {
  return (
    <Link href="/pacientes" className="block h-full transition-opacity hover:opacity-90">
      <ProfileSectionCard title="Mis pacientes">
        <div className="mt-auto flex flex-1 flex-col justify-end gap-1 lg:gap-2">
          <p className="text-sm text-muted-foreground">Total de pacientes</p>
          <p className="text-3xl font-bold text-primary lg:text-4xl">{patientCount}</p>
        </div>
      </ProfileSectionCard>
    </Link>
  );
}
