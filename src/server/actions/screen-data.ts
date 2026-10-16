"use server";

import { currentUser } from "@clerk/nextjs/server";
import { subDays } from "date-fns";

import {
  getCurrentWeek,
  getDateKey,
  getDayPeriod,
  getStreak,
} from "@/lib/dates";
import { getRecordQuadrant } from "@/lib/emotions";
import { requireProfile, requireRole } from "@/server/auth/get-current-profile";
import {
  getPatientPendingRequest,
  getPatientPsychologist,
  getPatientRecordCount,
  getPatientRecords,
  getPatientRecordsSince,
  getPsychologistPatients,
  getRecentPatientRecords,
  getReminderSettings,
} from "@/server/queries";

const RECENT_RECORDS_LIMIT = 4;
const STREAK_WINDOW_DAYS = 60;

export async function getHomeScreenData() {
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

  return {
    firstName: profile.firstName,
    period: getDayPeriod(now),
    streak: getStreak(windowRecords.map((record) => record.occurredAt), now),
    week,
    todayRecords,
    recentRecords,
  };
}

export async function getMyRecordsScreenData() {
  const profile = await requireRole("patient");

  return getPatientRecords(profile.id);
}

export async function getProfileScreenData() {
  const profile = await requireProfile();
  const user = await currentUser();
  const identity = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    avatarUrl: profile.avatarUrl,
    imageUrl: user?.imageUrl ?? null,
    memberSince: profile.createdAt,
  };

  if (profile.role === "patient") {
    const [psychologist, pendingRequest, recordCount, reminderSettings] =
      await Promise.all([
        getPatientPsychologist(profile.id),
        getPatientPendingRequest(profile.id),
        getPatientRecordCount(profile.id),
        getReminderSettings(profile.id),
      ]);

    return {
      ...identity,
      role: profile.role,
      psychologist,
      pendingRequest,
      recordCount,
      remindersEnabled: reminderSettings?.enabled ?? false,
    };
  }

  const patients = await getPsychologistPatients(profile.id);

  return {
    ...identity,
    role: profile.role!,
    patientCount: patients.length,
  };
}
