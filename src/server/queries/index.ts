import { and, count, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { resolveAvatarUrls } from "@/server/profiles/resolve-avatar-urls";
import {
  connectionRequests,
  customEmotions,
  inviteLinks,
  patientRecords,
  profiles,
  psychologistPatient,
  userReminders,
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

  return resolveAvatarUrls(
    patients.map((patient) => ({
      ...patient,
      unseenCount: unseenMap.get(patient.id) ?? 0,
    })),
  );
}

export async function getCustomEmotions(userId: string) {
  return db
    .select()
    .from(customEmotions)
    .where(eq(customEmotions.userId, userId))
    .orderBy(customEmotions.name);
}

export async function getProfileById(profileId: string) {
  const [profile] = await db
    .select({
      id: profiles.id,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1);

  return profile ?? null;
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

export async function getRecentPatientRecords(
  patientId: string,
  limit: number,
) {
  return db
    .select()
    .from(patientRecords)
    .where(eq(patientRecords.patientId, patientId))
    .orderBy(desc(patientRecords.occurredAt))
    .limit(limit);
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

export async function getReminderSettings(userId: string) {
  const [settings] = await db
    .select()
    .from(userReminders)
    .where(eq(userReminders.userId, userId))
    .limit(1);

  return settings ?? null;
}

export async function getInviteLink(psychologistId: string) {
  const [link] = await db
    .select()
    .from(inviteLinks)
    .where(eq(inviteLinks.psychologistId, psychologistId))
    .limit(1);

  return link ?? null;
}

export async function getInviteLinkByToken(token: string) {
  const [link] = await db
    .select()
    .from(inviteLinks)
    .where(eq(inviteLinks.token, token))
    .limit(1);

  return link ?? null;
}

export async function getPendingConnectionRequests(psychologistId: string) {
  return db
    .select({
      id: connectionRequests.id,
      createdAt: connectionRequests.createdAt,
      patientId: profiles.id,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(connectionRequests)
    .innerJoin(profiles, eq(profiles.id, connectionRequests.patientId))
    .where(
      and(
        eq(connectionRequests.psychologistId, psychologistId),
        eq(connectionRequests.status, "pending"),
      ),
    )
    .orderBy(desc(connectionRequests.createdAt));
}

export async function getPatientPendingRequest(patientId: string) {
  const [request] = await db
    .select({
      id: connectionRequests.id,
      createdAt: connectionRequests.createdAt,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(connectionRequests)
    .innerJoin(profiles, eq(profiles.id, connectionRequests.psychologistId))
    .where(
      and(
        eq(connectionRequests.patientId, patientId),
        eq(connectionRequests.status, "pending"),
      ),
    )
    .limit(1);

  return request ?? null;
}
