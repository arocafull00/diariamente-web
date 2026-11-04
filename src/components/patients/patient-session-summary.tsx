import { CalendarCheck } from "lucide-react";

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
    : "Marca la sesión al terminarla para ver qué pasa entre sesiones";
  const rowDescription = lastSessionAt
    ? `${summary.recordCount} ${recordLabel} · ${sessionLabel.toLowerCase()}`
    : "Marca la sesión al terminarla";

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
          <SheetDescription>{sessionLabel}</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6">
          <section className="space-y-5 rounded-[2rem] bg-card/80 px-5 py-6 shadow-sm ring-1 ring-border/50 backdrop-blur">
            <p className="flex items-baseline gap-2">
              <span className="font-display text-4xl leading-none font-medium text-mood-lp-strong tabular-nums">
                {summary.recordCount}
              </span>
              <span className="text-sm text-muted-foreground">
                {recordLabel}
              </span>
            </p>
            {summary.recordCount > 0 ? (
              <PatientSessionSummaryDetails summary={summary} gender={gender} />
            ) : null}
          </section>
          <div className="mt-auto">
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
