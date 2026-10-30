import { FeedbackProfileCard } from "@/components/feedback/feedback-profile-card";

import { ProfileHeader } from "./profile-header";
import { ProfileLayout } from "./profile-layout";
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
    <ProfileLayout
      header={
        <ProfileHeader
          firstName={firstName}
          lastName={lastName}
          role="psychologist"
          avatarUrl={avatarUrl}
          imageUrl={imageUrl}
          memberSince={memberSince}
        />
      }
    >
      <ProfilePatientsSummaryCard patientCount={patientCount} />
      <FeedbackProfileCard role="psychologist" />
    </ProfileLayout>
  );
}
