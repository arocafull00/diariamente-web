import { ProfileHeader } from "./profile-header";
import { ProfilePatientsSummaryCard } from "./profile-patients-summary-card";

type PsychologistProfileProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  imageUrl: string | null;
  memberSince: Date;
  patientCount: number;
};

export function PsychologistProfile({
  firstName,
  lastName,
  avatarUrl,
  imageUrl,
  memberSince,
  patientCount,
}: PsychologistProfileProps) {
  return (
    <div className="space-y-4 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:gap-6 lg:space-y-0">
      <ProfileHeader
        firstName={firstName}
        lastName={lastName}
        role="psychologist"
        avatarUrl={avatarUrl}
        imageUrl={imageUrl}
        memberSince={memberSince}
      />
      <div className="space-y-4">
        <ProfilePatientsSummaryCard patientCount={patientCount} />
      </div>
    </div>
  );
}
