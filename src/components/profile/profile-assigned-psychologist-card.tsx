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
    <ProfileSectionCard
      title="Psicólogo/a asignado"
      action={<ProfileUnlinkPsychologistButton />}
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
          <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">
            {getFullName(firstName, lastName)}
          </p>
          <p className="text-sm text-muted-foreground">Psicólogo/a asignado</p>
        </div>
      </div>
    </ProfileSectionCard>
  );
}
