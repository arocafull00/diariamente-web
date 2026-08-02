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
    <div className="space-y-4">
      <ProfileHeader
        firstName={firstName}
        lastName={lastName}
        role="psychologist"
        avatarUrl={avatarUrl}
        imageUrl={imageUrl}
        memberSince={memberSince}
        reminderSettings={null}
      />
      <ProfilePatientsSummaryCard patientCount={patientCount} />
    </div>
  );
}
