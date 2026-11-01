import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  formatLastActivityLabel,
  formatMemberSince,
  getFullName,
  getInitials,
} from "@/lib/utils-app";

type ClinicPsychologistSummaryProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  joinedAt: Date;
  lastActiveAt: Date;
};

export function ClinicPsychologistSummary({
  firstName,
  lastName,
  avatarUrl,
  joinedAt,
  lastActiveAt,
}: ClinicPsychologistSummaryProps) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-sm ring-1 ring-border/60 lg:p-5">
      <Avatar className="size-14 rounded-2xl after:rounded-2xl">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt="" className="rounded-2xl" />
        ) : null}
        <AvatarFallback className="rounded-2xl bg-secondary font-semibold text-primary">
          {getInitials(firstName, lastName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">
          {getFullName(firstName, lastName)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          En la clínica desde {formatMemberSince(joinedAt)}
        </p>
        <p className="text-sm text-muted-foreground">
          Última conexión: {formatLastActivityLabel(lastActiveAt)}
        </p>
      </div>
    </div>
  );
}
