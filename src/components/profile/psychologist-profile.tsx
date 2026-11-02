import { ProfileSubscriptionCard } from "@/components/billing/profile-subscription-card";
import type { BillingSummary } from "@/components/billing/billing-status-copy";
import { FeedbackProfileCard } from "@/components/feedback/feedback-profile-card";

import { ProfileClinicCard } from "./profile-clinic-card";
import { ProfileHeader } from "./profile-header";
import { ProfileLayout } from "./profile-layout";
import { ProfilePatientsSummaryCard } from "./profile-patients-summary-card";

type PsychologistProfileProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  imageUrl: string | null;
  memberSince: Date;
  billing: BillingSummary;
  patientCount: number;
  clinic: { name: string } | null;
};

export function PsychologistProfile({
  firstName,
  lastName,
  avatarUrl,
  imageUrl,
  memberSince,
  billing,
  patientCount,
  clinic,
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
      <ProfileSubscriptionCard billing={billing} />
      {clinic ? <ProfileClinicCard name={clinic.name} /> : null}
      <FeedbackProfileCard role="psychologist" />
    </ProfileLayout>
  );
}
