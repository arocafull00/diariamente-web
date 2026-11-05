import { differenceInCalendarDays } from "date-fns";
import { CalendarCheck } from "lucide-react";

import { ClinicStatCard } from "@/components/clinics/clinic-stat-card";
import { PatientSessionButton } from "@/components/patients/patient-session-button";
import { PatientSessionSummaryDetails } from "@/components/patients/patient-session-summary-details";
import {
  SettingsRowContent,
  settingsRowClassName,
} from "@/components/profile/settings-row-content";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { GrammaticalGender, PatientRecord } from "@/db/schema";
import { getSessionSummary } from "@/lib/session-summary";
import { formatLastActivityLabel } from "@/lib/utils-app";

type PatientSessionSummaryProps = {
  patientId: string;
  patientName: string;
  gender: GrammaticalGender;
  lastSessionAt: Date | null;
  records: Pick<
    PatientRecord,
    "id" | "occurredAt" | "createdAt" | "emotions" | "context"
  >[];
};

export function PatientSessionSummary({
  patientId,
  patientName,
  gender,
  lastSessionAt,
  records,
}: PatientSessionSummaryProps) {
  const summary = getSessionSummary(records, lastSessionAt);
  const recordLabel =
    summary.recordCount === 1 ? "registro nuevo" : "registros nuevos";
  const title = lastSessionAt
    ? "Desde la última sesión"
    : "Antes de la primera sesión";
  const sessionLabel = lastSessionAt
    ? `Última sesión ${formatLastActivityLabel(lastSessionAt)}`
    : null;
  const rowDescription = sessionLabel
    ? `${summary.recordCount} ${recordLabel} · ${sessionLabel.toLowerCase()}`
    : "Marca la sesión al terminarla";
  const daysSinceSession = lastSessionAt
    ? differenceInCalendarDays(new Date(), lastSessionAt)
    : null;

  return (
    <Sheet>
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs">
        <SheetTrigger className={settingsRowClassName}>
          <SettingsRowContent
            icon={CalendarCheck}
            tone="green"
            title={title}
            description={rowDescription}
          />
        </SheetTrigger>
      </div>
      <SheetContent
        side="right"
        className="flex flex-col gap-0 bg-background sm:max-w-md"
      >
        <SheetHeader className="px-5 pt-6 pb-4">
          <SheetTitle className="text-2xl font-bold tracking-tight">
            {title}
          </SheetTitle>
          {sessionLabel ? (
            <SheetDescription>{sessionLabel}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 pb-6">
          <div
            className={
              daysSinceSession !== null
                ? "grid grid-cols-2 gap-3"
                : "grid gap-3"
            }
          >
            <ClinicStatCard
              label={
                summary.recordCount === 1 ? "Registro nuevo" : "Registros nuevos"
              }
              value={summary.recordCount}
              quadrant="LOW_PLEASANT"
              inline={daysSinceSession === null}
            />
            {daysSinceSession !== null ? (
              <ClinicStatCard
                label={
                  daysSinceSession === 1
                    ? "Día desde la sesión"
                    : "Días desde la sesión"
                }
                value={daysSinceSession}
                quadrant="LOW_UNPLEASANT"
              />
            ) : null}
          </div>
          {summary.recordCount > 0 ? (
            <PatientSessionSummaryDetails
              patientId={patientId}
              summary={summary}
              gender={gender}
            />
          ) : null}
          <div className="mt-auto pt-3">
            <PatientSessionButton
              patientId={patientId}
              patientName={patientName}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
