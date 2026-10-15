import { BookOpen } from "lucide-react";

import { ProfileStatCard } from "./profile-stat-card";

type ProfileRecordsSummaryCardProps = {
  recordCount: number;
};

export function ProfileRecordsSummaryCard({
  recordCount,
}: ProfileRecordsSummaryCardProps) {
  return (
    <ProfileStatCard
      href="/mis-registros"
      title="Mis registros"
      label={recordCount === 1 ? "registro en total" : "registros en total"}
      value={recordCount}
      icon={BookOpen}
    />
  );
}
