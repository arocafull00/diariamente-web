import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AppHeader } from "@/components/app-shell/app-header";
import { HomeEmptyRecords } from "@/components/home/home-empty-records";
import { HomePsychologistPanel } from "@/components/home/home-psychologist-panel";
import { HomeWelcomePanel } from "@/components/home/home-welcome-panel";
import { RecordCard } from "@/components/records/record-card";
import { getFullName } from "@/lib/utils-app";
import { requireRole } from "@/server/auth/get-current-profile";
import {
  getLatestPatientRecord,
  getPatientPsychologist,
  getPatientRecordCount,
} from "@/server/queries";

export default async function PatientHomePage() {
  const profile = await requireRole("patient");
  const [recordCount, latestRecord, psychologist] = await Promise.all([
    getPatientRecordCount(profile.id),
    getLatestPatientRecord(profile.id),
    getPatientPsychologist(profile.id),
  ]);

  return (
    <>
      <AppHeader title="Inicio" />
      <div className="space-y-5">
        <HomeWelcomePanel
          firstName={profile.firstName}
          recordCount={recordCount}
        />

        {latestRecord ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-4 px-1">
              <h2 className="font-semibold">Tu registro más reciente</h2>
              <Link
                href="/mis-registros"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary outline-none hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Ver todos
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <RecordCard
              record={latestRecord}
              href={`/registro/${latestRecord.id}`}
            />
          </section>
        ) : (
          <HomeEmptyRecords />
        )}

        {psychologist ? (
          <HomePsychologistPanel
            name={getFullName(
              psychologist.firstName,
              psychologist.lastName,
            )}
          />
        ) : null}
      </div>
    </>
  );
}
