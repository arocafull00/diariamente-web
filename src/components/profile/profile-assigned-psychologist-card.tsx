import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFullName, getInitials } from "@/lib/utils-app";

import { ProfileSectionCard } from "./profile-section-card";
import { ProfileUnlinkPsychologistButton } from "./profile-unlink-psychologist-button";

type ProfileAssignedPsychologistCardProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

export function ProfileAssignedPsychologistCard({
  firstName,
  lastName,
  avatarUrl,
}: ProfileAssignedPsychologistCardProps) {
  return (
    <ProfileSectionCard title="Tu psicólogo/a">
      <div className="flex items-center gap-3">
        <Avatar className="size-12 ring-2 ring-accent">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
          <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">
            {getFullName(firstName, lastName)}
          </p>
          <p className="text-sm text-muted-foreground">Vinculado contigo</p>
        </div>
        <ProfileUnlinkPsychologistButton />
      </div>
    </ProfileSectionCard>
  );
}
