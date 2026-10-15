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
    <header className="flex flex-col items-center gap-4 pt-4 pb-4 text-center lg:rounded-3xl lg:border lg:border-border/60 lg:bg-card lg:p-8 lg:shadow-xs">
      <div className="relative">
        <Avatar className="size-28 text-lg shadow-lg ring-4 ring-card lg:size-32">
          {resolvedAvatarUrl ? (
            <AvatarImage src={resolvedAvatarUrl} alt="" />
          ) : null}
          <AvatarFallback className="bg-accent text-2xl font-semibold text-primary">
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
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          {getFullName(firstName, lastName)}
        </h1>
        <Badge
          variant="secondary"
          className="h-6 rounded-full bg-accent px-3 font-semibold text-primary"
        >
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
