import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SettingsSignOutDialog } from "@/components/profile/settings-sign-out-dialog";
import type { UserRole } from "@/db/schema";
import { getFullName, getInitials, getRoleLabel } from "@/lib/utils-app";

type SidebarUserCardProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: UserRole;
};

export function SidebarUserCard({
  firstName,
  lastName,
  avatarUrl,
  role,
}: SidebarUserCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
      <Avatar size="lg" className="shrink-0">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
        <AvatarFallback className="text-sm font-semibold text-primary">
          {getInitials(firstName, lastName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {getFullName(firstName, lastName)}
        </p>
        <p className="text-xs text-muted-foreground">{getRoleLabel(role)}</p>
      </div>
      <SettingsSignOutDialog variant="icon" />
    </div>
  );
}
