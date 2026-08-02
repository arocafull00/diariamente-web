import { AppHeaderBackButton } from "@/components/app-shell/app-header-back-button";
import { PatientUnlinkButton } from "@/components/patients/patient-unlink-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatLastActivityLabel, getFullName, getInitials } from "@/lib/utils-app";

type PatientDetailHeaderProps = {
  patientId: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  recordCount: number;
  lastActivityAt: Date | null;
};

export function PatientDetailHeader({
  patientId,
  firstName,
  lastName,
  avatarUrl,
  recordCount,
  lastActivityAt,
}: PatientDetailHeaderProps) {
  const patientName = getFullName(firstName, lastName);
  const recordLabel = recordCount === 1 ? "registro" : "registros";
  const activityLabel = lastActivityAt
    ? `Última actividad ${formatLastActivityLabel(lastActivityAt)}`
    : "Sin actividad reciente";

  return (
    <header className="sticky top-0 z-40 overflow-hidden border-b border-border bg-card pt-[max(0px,env(safe-area-inset-top))]">
      <div
        className="absolute inset-y-0 right-0 w-1/3 bg-secondary/70 [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]"
        aria-hidden="true"
      />

      <div className="relative flex w-full items-center gap-4 px-5 py-5 sm:px-6">
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
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-base font-semibold text-foreground">
              {patientName}
            </h1>
            <Badge className="h-auto rounded-full bg-intensity-low px-2 py-0.5 text-[11px] font-medium text-intensity-low-foreground ring-1 ring-inset ring-intensity-low-accent/20">
              Activo
            </Badge>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {recordCount} {recordLabel}
            </span>
            <span
              className="size-1 rounded-full bg-border"
              aria-hidden="true"
            />
            <span>{activityLabel}</span>
          </div>
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
