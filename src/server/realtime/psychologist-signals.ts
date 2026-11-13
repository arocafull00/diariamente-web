import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { patientRecords, psychologistPatient } from "@/db/schema";

import { realtime } from "./realtime";

const RECORDS_SIGNAL_LIMIT = 50;

function linkedPatientsSignalQuery(psychologistId: string) {
  return db
    .select({ id: psychologistPatient.id })
    .from(psychologistPatient)
    .where(eq(psychologistPatient.psychologistId, psychologistId));
}

function patientRecordsSignalQuery(psychologistId: string) {
  return db
    .select({ id: patientRecords.id })
    .from(patientRecords)
    .innerJoin(
      psychologistPatient,
      eq(psychologistPatient.patientId, patientRecords.patientId),
    )
    .where(eq(psychologistPatient.psychologistId, psychologistId))
    .orderBy(desc(patientRecords.createdAt), desc(patientRecords.id))
    .limit(RECORDS_SIGNAL_LIMIT);
}

function requireRealtime() {
  if (!realtime) {
    throw new Error("Realtime is not configured");
  }

  return realtime;
}

export function sealLinkedPatientsSignal(psychologistId: string) {
  return requireRealtime().seal({
    query: linkedPatientsSignalQuery(psychologistId),
  });
}

export function sealPatientRecordsSignal(psychologistId: string) {
  return requireRealtime().seal({
    query: patientRecordsSignalQuery(psychologistId),
  });
}

export async function sealPsychologistSignals(psychologistId: string) {
  if (!realtime) {
    return null;
  }

  const [patients, records] = await Promise.all([
    sealLinkedPatientsSignal(psychologistId),
    sealPatientRecordsSignal(psychologistId),
  ]);

  return { patients, records };
}
