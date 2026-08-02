import Link from "next/link";

import { ProfileSectionCard } from "./profile-section-card";

type ProfileRecordsSummaryCardProps = {
  recordCount: number;
};

export function ProfileRecordsSummaryCard({
  recordCount,
}: ProfileRecordsSummaryCardProps) {
  return (
    <Link href="/mis-registros" className="block transition-opacity hover:opacity-90">
      <ProfileSectionCard title="Mis registros">
        <div className="flex items-end justify-between gap-4">
          <p className="text-sm text-muted-foreground">Total de registros:</p>
          <p className="text-3xl font-bold text-primary">{recordCount}</p>
        </div>
      </ProfileSectionCard>
    </Link>
  );
}
