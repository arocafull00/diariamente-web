import { Plus } from "lucide-react";
import Link from "next/link";

import { AppHeader } from "@/components/app-shell/app-header";
import { NewRecordHeaderButton } from "@/components/app-shell/new-record-header-button";
import { MoodBubble } from "@/components/records/mood-bubble";
import { RecordMoodOverview } from "@/components/records/record-mood-overview";
import { RecordTimeline } from "@/components/records/record-timeline";
import { requireRole } from "@/server/auth/get-current-profile";
import { getPatientRecords } from "@/server/queries";

export default async function MyRecordsPage() {
  const profile = await requireRole("patient");
  const records = await getPatientRecords(profile.id);

  return (
    <>
      <AppHeader title="Mis registros" action={<NewRecordHeaderButton />} />
      <div className="space-y-6">
        {records.length === 0 ? (
          <section className="relative overflow-hidden rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60">
            <div className="mx-auto mb-6 flex w-fit -space-x-3" aria-hidden="true">
              <MoodBubble quadrant="HIGH_UNPLEASANT" tone={3} className="size-12" />
              <MoodBubble quadrant="HIGH_PLEASANT" tone={3} className="size-12" />
              <MoodBubble quadrant="LOW_UNPLEASANT" tone={3} className="size-12" />
              <MoodBubble quadrant="LOW_PLEASANT" tone={3} className="size-12" />
            </div>
            <h2 className="font-display text-2xl font-medium">Tu espacio está listo</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
              Registra cómo te sientes y aquí irás viendo tu recorrido entre
              sesiones.
            </p>
            <Link
              href="/nuevo-registro"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background shadow-lg outline-none transition-transform active:scale-95 focus-visible:ring-4 focus-visible:ring-ring/50"
            >
              <Plus className="size-4" aria-hidden="true" />
              Crear primer registro
            </Link>
          </section>
        ) : (
          <>
            <RecordMoodOverview title="Tu balance emocional" records={records} />
            <RecordTimeline records={records} showUnseen={false} />
          </>
        )}
      </div>
    </>
  );
}
