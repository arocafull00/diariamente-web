import { and, count, desc, eq, gt, isNull } from "drizzle-orm";

import { db } from "@/db";
import {
  customEmotions,
  invitations,
  patientRecords,
  profiles,
  psychologistPatient,
} from "@/db/schema";

export async function getPatientRecords(patientId: string) {
  return db
    .select()
    .from(patientRecords)
    .where(eq(patientRecords.patientId, patientId))
    .orderBy(desc(patientRecords.occurredAt));
}

export async function getPsychologistPatients(psychologistId: string) {
  const patients = await db
    .select({
      id: profiles.id,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      avatarUrl: profiles.avatarUrl,
      linkedAt: psychologistPatient.linkedAt,
    })
    .from(psychologistPatient)
    .innerJoin(profiles, eq(profiles.id, psychologistPatient.patientId))
    .where(eq(psychologistPatient.psychologistId, psychologistId))
    .orderBy(desc(psychologistPatient.linkedAt));

  const unseenCounts = await db
    .select({
      patientId: patientRecords.patientId,
      unseenCount: count(),
    })
    .from(patientRecords)
    .innerJoin(
      psychologistPatient,
      eq(patientRecords.patientId, psychologistPatient.patientId),
    )
    .where(
      and(
        eq(psychologistPatient.psychologistId, psychologistId),
        isNull(patientRecords.seenAt),
      ),
    )
    .groupBy(patientRecords.patientId);

  const unseenMap = new Map(
    unseenCounts.map((item) => [item.patientId, Number(item.unseenCount)]),
  );

  return patients.map((patient) => ({
    ...patient,
    unseenCount: unseenMap.get(patient.id) ?? 0,
  }));
}

export async function getCustomEmotions(userId: string) {
  return db
    .select()
    .from(customEmotions)
    .where(eq(customEmotions.userId, userId))
    .orderBy(customEmotions.name);
}

export async function getPatientPsychologist(patientId: string) {
  const [relationship] = await db
    .select({
      psychologistId: psychologistPatient.psychologistId,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(psychologistPatient)
    .innerJoin(
      profiles,
      eq(profiles.id, psychologistPatient.psychologistId),
    )
    .where(eq(psychologistPatient.patientId, patientId))
    .limit(1);

  return relationship ?? null;
}

export async function getLatestPatientRecord(patientId: string) {
  const [record] = await db
    .select()
    .from(patientRecords)
    .where(eq(patientRecords.patientId, patientId))
    .orderBy(desc(patientRecords.occurredAt))
    .limit(1);

  return record ?? null;
}

export async function getPatientRecordCount(patientId: string) {
  const [result] = await db
    .select({ total: count() })
    .from(patientRecords)
    .where(eq(patientRecords.patientId, patientId));

  return Number(result?.total ?? 0);
}

export async function getUnseenRecordCountForPatient(
  psychologistId: string,
  patientId: string,
) {
  const [result] = await db
    .select({ total: count() })
    .from(patientRecords)
    .innerJoin(
      psychologistPatient,
      eq(patientRecords.patientId, psychologistPatient.patientId),
    )
    .where(
      and(
        eq(psychologistPatient.psychologistId, psychologistId),
        eq(patientRecords.patientId, patientId),
        isNull(patientRecords.seenAt),
      ),
    );

  return Number(result?.total ?? 0);
}

export async function getActiveInvitation(psychologistId: string) {
  const [invitation] = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.psychologistId, psychologistId),
        isNull(invitations.usedAt),
        isNull(invitations.revokedAt),
        gt(invitations.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(invitations.createdAt))
    .limit(1);

  return invitation ?? null;
}
