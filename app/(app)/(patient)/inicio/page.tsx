import { subDays } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { HomeCheckIn } from "@/components/home/home-check-in";
import { HomeLatestMood } from "@/components/home/home-latest-mood";
import { StaggerItem } from "@/components/motion/stagger-item";
import { StaggerList } from "@/components/motion/stagger-list";
import { RecordCard } from "@/components/records/record-card";
import {
  getCurrentWeek,
  getDateKey,
  getDayPeriod,
  getStreak,
} from "@/lib/dates";
import { getRecordQuadrant } from "@/lib/emotions";
import { requireRole } from "@/server/auth/get-current-profile";
import {
  getPatientRecordsSince,
  getRecentPatientRecords,
} from "@/server/queries";

const RECENT_RECORDS_LIMIT = 4;
const STREAK_WINDOW_DAYS = 60;

export default async function PatientHomePage() {
  const profile = await requireRole("patient");
  const now = new Date();
  const [windowRecords, recentRecords] = await Promise.all([
    getPatientRecordsSince(profile.id, subDays(now, STREAK_WINDOW_DAYS)),
    getRecentPatientRecords(profile.id, RECENT_RECORDS_LIMIT),
  ]);

  const recordsByDay = new Map<string, typeof windowRecords>();

  for (const record of windowRecords) {
    const key = getDateKey(record.occurredAt);
    recordsByDay.set(key, [...(recordsByDay.get(key) ?? []), record]);
  }

  const week = getCurrentWeek(now).map((day) => {
    const dayRecords = recordsByDay.get(day.key) ?? [];
    const latest = dayRecords[0];

    return {
      ...day,
      hasRecord: dayRecords.length > 0,
      quadrant: latest ? getRecordQuadrant(latest) : null,
    };
  });

  const todayRecords = [...(recordsByDay.get(getDateKey(now)) ?? [])]
    .reverse()
    .map((record) => ({ id: record.id, quadrant: getRecordQuadrant(record) }));

  const [latestRecord, ...olderRecords] = recentRecords;

  return (
    <div className="space-y-6 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-8 lg:space-y-0">
      <HomeCheckIn
        firstName={profile.firstName}
        period={getDayPeriod(now)}
        streak={getStreak(windowRecords.map((record) => record.occurredAt), now)}
        week={week}
        todayRecords={todayRecords}
      />

      <div className="space-y-6">
        {latestRecord ? <HomeLatestMood record={latestRecord} /> : null}

        {olderRecords.length > 0 ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-4 px-1">
              <h2 className="font-semibold">Antes</h2>
              <Link
                href="/mis-registros"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary outline-none hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Ver todos
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <StaggerList className="space-y-3">
              {olderRecords.map((record) => (
                <StaggerItem key={record.id}>
                  <RecordCard record={record} href={`/registro/${record.id}`} />
                </StaggerItem>
              ))}
            </StaggerList>
          </section>
        ) : null}
      </div>
    </div>
  );
}
