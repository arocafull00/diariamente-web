import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { patientRecords, psychologistPatient } from "@/db/schema";

import { requireProfile } from "./get-current-profile";

export async function requireRecordAccess(recordId: string) {
  const profile = await requireProfile();

  if (profile.role === "patient") {
    const [record] = await db
      .select()
      .from(patientRecords)
      .where(
        and(
          eq(patientRecords.id, recordId),
          eq(patientRecords.patientId, profile.id),
        ),
      )
      .limit(1);

    if (!record) {
      notFound();
    }

    return { profile, record };
  }

  const [record] = await db
    .select({
      id: patientRecords.id,
      patientId: patientRecords.patientId,
      occurredAt: patientRecords.occurredAt,
      situation: patientRecords.situation,
      thoughts: patientRecords.thoughts,
      behaviours: patientRecords.behaviours,
      emotions: patientRecords.emotions,
      quadrant: patientRecords.quadrant,
      context: patientRecords.context,
      emotionIntensity: patientRecords.emotionIntensity,
      seenAt: patientRecords.seenAt,
      createdAt: patientRecords.createdAt,
      updatedAt: patientRecords.updatedAt,
    })
    .from(patientRecords)
    .innerJoin(
      psychologistPatient,
      eq(patientRecords.patientId, psychologistPatient.patientId),
    )
    .where(
      and(
        eq(patientRecords.id, recordId),
        eq(psychologistPatient.psychologistId, profile.id),
      ),
    )
    .limit(1);

  if (!record) {
    notFound();
  }

  return { profile, record };
}
