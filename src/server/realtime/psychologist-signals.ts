import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  connectionRequests,
  patientRecords,
  psychologistPatient,
} from "@/db/schema";

import { realtime } from "./realtime";

const RECORDS_SIGNAL_LIMIT = 50;

function pendingRequestsSignalQuery(psychologistId: string) {
  return db
    .select({ id: connectionRequests.id })
    .from(connectionRequests)
    .where(
      and(
        eq(connectionRequests.psychologistId, psychologistId),
        eq(connectionRequests.status, "pending"),
      ),
    );
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

export function sealPendingRequestsSignal(psychologistId: string) {
  return requireRealtime().seal({
    query: pendingRequestsSignalQuery(psychologistId),
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

  const [requests, records] = await Promise.all([
    sealPendingRequestsSignal(psychologistId),
    sealPatientRecordsSignal(psychologistId),
  ]);

  return { requests, records };
}
