import { AppHeaderBackButton } from "@/components/app-shell/app-header-back-button";
import { PatientUnlinkButton } from "@/components/patients/patient-unlink-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatLastActivityLabel, getFullName, getInitials } from "@/lib/utils-app";

type PatientDetailHeaderProps = {
  patientId: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  lastActivityAt: Date | null;
};

export function PatientDetailHeader({
  patientId,
  firstName,
  lastName,
  avatarUrl,
  lastActivityAt,
}: PatientDetailHeaderProps) {
  const patientName = getFullName(firstName, lastName);
  const activityLabel = lastActivityAt
    ? `Última actividad ${formatLastActivityLabel(lastActivityAt)}`
    : "Sin actividad reciente";

  return (
    <header className="sticky top-0 z-40 overflow-hidden border-b border-border bg-card pt-[max(0px,env(safe-area-inset-top))]">
      <div
        className="absolute inset-y-0 right-0 w-1/3 bg-secondary/70 [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-7xl items-center gap-4 px-5 py-5 sm:px-6 lg:px-8">
        <AppHeaderBackButton />

        <Avatar className="size-12 shrink-0 rounded-2xl after:rounded-2xl">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="" className="rounded-2xl" />
          ) : null}
          <AvatarFallback className="rounded-2xl bg-secondary text-sm font-semibold text-primary ring-1 ring-border">
            {getInitials(firstName, lastName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-foreground">
            {patientName}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">{activityLabel}</p>
        </div>

        <PatientUnlinkButton
          patientId={patientId}
          patientName={patientName}
          layout="header"
        />
      </div>
    </header>
  );
}
