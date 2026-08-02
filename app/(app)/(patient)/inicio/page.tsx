import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import Link from "next/link";

import { AppHeader } from "@/components/app-shell/app-header";
import { NewRecordHeaderButton } from "@/components/app-shell/new-record-header-button";
import { HomeEmptyRecords } from "@/components/home/home-empty-records";
import { HomeProfileCard } from "@/components/home/home-profile-card";
import { HomePsychologistPanel } from "@/components/home/home-psychologist-panel";
import { HomeRecentRecordItem } from "@/components/home/home-recent-record-item";
import { HomeStatCard } from "@/components/home/home-stat-card";
import { HomeWelcomePanel } from "@/components/home/home-welcome-panel";
import { formatOccurrenceDate, formatOccurrenceTime, getFullName } from "@/lib/utils-app";
import { requireRole } from "@/server/auth/get-current-profile";
import {
  getPatientPsychologist,
  getPatientRecordCount,
  getRecentPatientRecords,
} from "@/server/queries";

const RECENT_RECORDS_LIMIT = 3;

export default async function PatientHomePage() {
  const profile = await requireRole("patient");
  const [recordCount, recentRecords, psychologist] = await Promise.all([
    getPatientRecordCount(profile.id),
    getRecentPatientRecords(profile.id, RECENT_RECORDS_LIMIT),
    getPatientPsychologist(profile.id),
  ]);
  const latestRecord = recentRecords[0] ?? null;

  return (
    <>
      <AppHeader
        title="Inicio"
        eyebrow="Espacio personal"
        action={<NewRecordHeaderButton />}
      />
      <div className="space-y-5 lg:space-y-6">
        <HomeWelcomePanel
          firstName={profile.firstName}
          recordCount={recordCount}
        />

        {latestRecord ? (
          <div className="hidden gap-4 lg:grid lg:grid-cols-2">
            <HomeStatCard
              label="Registros guardados"
              value={String(recordCount)}
              hint="Total de registros"
              icon={BookOpen}
            />
            <HomeStatCard
              label="Último registro"
              value={formatOccurrenceDate(new Date(latestRecord.occurredAt))}
              hint={`A las ${formatOccurrenceTime(new Date(latestRecord.occurredAt))}`}
              icon={CalendarDays}
              iconClassName="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1.5fr)_340px] lg:items-start lg:gap-6">
          {latestRecord ? (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-4 px-1">
                <h2 className="font-semibold">Tus registros recientes</h2>
                <Link
                  href="/mis-registros"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary outline-none hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Ver todos
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentRecords.map((record, index) => (
                  <HomeRecentRecordItem
                    key={record.id}
                    record={record}
                    desktopOnly={index > 0}
                  />
                ))}
              </div>
            </section>
          ) : (
            <HomeEmptyRecords />
          )}

          <aside className="space-y-4">
            {psychologist ? (
              <HomePsychologistPanel
                name={getFullName(
                  psychologist.firstName,
                  psychologist.lastName,
                )}
              />
            ) : null}
            <HomeProfileCard
              firstName={profile.firstName}
              lastName={profile.lastName}
              avatarUrl={profile.avatarUrl}
            />
          </aside>
        </div>
      </div>
    </>
  );
}
