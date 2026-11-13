import { InviteCodeForm } from "@/components/invitations/invite-code-form";

import { ProfileSectionCard } from "./profile-section-card";

export function ProfileLinkPsychologistCard() {
  return (
    <ProfileSectionCard title="Tu psicólogo/a">
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Escribe su código o escanea su QR y conectad al momento.
        </p>
        <InviteCodeForm />
      </div>
    </ProfileSectionCard>
  );
}
