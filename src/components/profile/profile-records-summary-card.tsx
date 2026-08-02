import Link from "next/link";

import { ProfileSectionCard } from "./profile-section-card";

type ProfileRecordsSummaryCardProps = {
  recordCount: number;
};

export function ProfileRecordsSummaryCard({
  recordCount,
}: ProfileRecordsSummaryCardProps) {
  return (
    <Link href="/mis-registros" className="block h-full transition-opacity hover:opacity-90">
      <ProfileSectionCard title="Mis registros">
        <div className="mt-auto flex flex-1 flex-col justify-end gap-1 lg:gap-2">
          <p className="text-sm text-muted-foreground">Total de registros</p>
          <p className="text-3xl font-bold text-primary lg:text-4xl">{recordCount}</p>
        </div>
      </ProfileSectionCard>
    </Link>
  );
}
