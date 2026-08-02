import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/db/schema";
import {
  formatMemberSince,
  getFullName,
  getInitials,
  getRoleLabel,
} from "@/lib/utils-app";

import { ProfileEditSheet } from "./profile-edit-sheet";

type ProfileHeaderProps = {
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  avatarUrl: string | null;
  imageUrl?: string | null;
  memberSince: Date;
};

export function ProfileHeader({
  firstName,
  lastName,
  role,
  avatarUrl,
  imageUrl,
  memberSince,
}: ProfileHeaderProps) {
  const resolvedAvatarUrl = avatarUrl ?? imageUrl ?? null;

  return (
    <header className="flex flex-col items-center gap-4 pt-2 pb-6 text-center lg:rounded-2xl lg:border lg:border-border lg:bg-card lg:p-8 lg:shadow-sm">
      <div className="relative">
        <Avatar className="size-24 text-lg lg:size-28">
          {resolvedAvatarUrl ? (
            <AvatarImage src={resolvedAvatarUrl} alt="" />
          ) : null}
          <AvatarFallback className="text-xl">
            {getInitials(firstName, lastName)}
          </AvatarFallback>
        </Avatar>
        <ProfileEditSheet
          firstName={firstName}
          lastName={lastName}
          avatarUrl={avatarUrl}
          imageUrl={imageUrl ?? null}
        />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
          {getFullName(firstName, lastName)}
        </h1>
        <Badge variant="secondary" className="bg-accent text-primary">
          {getRoleLabel(role)}
        </Badge>
        <p className="text-sm text-muted-foreground">
          Miembro desde{" "}
          <span className="font-semibold text-foreground">
            {formatMemberSince(memberSince)}
          </span>
        </p>
      </div>
    </header>
  );
}
