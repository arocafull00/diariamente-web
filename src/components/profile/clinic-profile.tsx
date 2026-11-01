import { FeedbackProfileCard } from "@/components/feedback/feedback-profile-card";

import { ProfileClinicTeamCard } from "./profile-clinic-team-card";
import { ProfileHeader } from "./profile-header";
import { ProfileLayout } from "./profile-layout";

type ClinicProfileProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  imageUrl: string | null;
  memberSince: Date;
  clinicName: string;
  psychologistCount: number;
};

export function ClinicProfile({
  firstName,
  lastName,
  avatarUrl,
  imageUrl,
  memberSince,
  clinicName,
  psychologistCount,
}: ClinicProfileProps) {
  return (
    <ProfileLayout
      header={
        <ProfileHeader
          firstName={firstName}
          lastName={lastName}
          role="clinic"
          avatarUrl={avatarUrl}
          imageUrl={imageUrl}
          memberSince={memberSince}
        />
      }
    >
      <ProfileClinicTeamCard
        clinicName={clinicName}
        psychologistCount={psychologistCount}
      />
      <FeedbackProfileCard role="clinic" />
    </ProfileLayout>
  );
}
