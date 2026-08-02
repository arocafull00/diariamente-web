import { ProfileAssignedPsychologistCard } from "./profile-assigned-psychologist-card";
import { ProfileHeader } from "./profile-header";
import { ProfileLinkPsychologistCard } from "./profile-link-psychologist-card";
import { ProfileRecordsSummaryCard } from "./profile-records-summary-card";

type PatientPsychologist = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

type PatientPendingRequest = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

type PatientProfileProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  imageUrl: string | null;
  memberSince: Date;
  recordCount: number;
  psychologist: PatientPsychologist | null;
  pendingRequest: PatientPendingRequest | null;
};

export function PatientProfile({
  firstName,
  lastName,
  avatarUrl,
  imageUrl,
  memberSince,
  recordCount,
  psychologist,
  pendingRequest,
}: PatientProfileProps) {
  return (
    <div className="space-y-4 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:gap-6 lg:space-y-0">
      <ProfileHeader
        firstName={firstName}
        lastName={lastName}
        role="patient"
        avatarUrl={avatarUrl}
        imageUrl={imageUrl}
        memberSince={memberSince}
      />
      <div className="space-y-4">
        {psychologist ? (
          <ProfileAssignedPsychologistCard
            firstName={psychologist.firstName}
            lastName={psychologist.lastName}
            avatarUrl={psychologist.avatarUrl}
          />
        ) : (
          <ProfileLinkPsychologistCard pendingRequest={pendingRequest} />
        )}
        <ProfileRecordsSummaryCard recordCount={recordCount} />
      </div>
    </div>
  );
}
