import { and, count, desc, eq, gte, inArray, isNull } from "drizzle-orm";

import { db } from "@/db";
import { resolveAvatarUrls } from "@/server/profiles/resolve-avatar-urls";
import {
  connectionRequests,
  inviteLinks,
  patientRecords,
  profiles,
  psychologistPatient,
  recordNotes,
  therapySessions,
  userReminders,
} from "@/db/schema";

export async function getPatientRecords(patientId: string) {
  return db
    .select()
    .from(patientRecords)
    .where(eq(patientRecords.patientId, patientId))
    .orderBy(desc(patientRecords.occurredAt));
}

export async function getPatientRecordsForPsychologist(
  patientId: string,
  psychologistId: string,
) {
  const records = await db
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
      bodySensations: patientRecords.bodySensations,
      emotionIntensity: patientRecords.emotionIntensity,
      seenAt: patientRecords.seenAt,
      createdAt: patientRecords.createdAt,
      updatedAt: patientRecords.updatedAt,
      noteId: recordNotes.id,
    })
    .from(patientRecords)
    .leftJoin(
      recordNotes,
      and(
        eq(recordNotes.recordId, patientRecords.id),
        eq(recordNotes.psychologistId, psychologistId),
      ),
    )
    .where(eq(patientRecords.patientId, patientId))
    .orderBy(desc(patientRecords.occurredAt));

  return records.map(({ noteId, ...record }) => ({
    ...record,
    hasNote: noteId !== null,
  }));
}

export async function getLastTherapySession(
  psychologistId: string,
  patientId: string,
) {
  const [session] = await db
    .select({ id: therapySessions.id, heldAt: therapySessions.heldAt })
    .from(therapySessions)
    .where(
      and(
        eq(therapySessions.psychologistId, psychologistId),
        eq(therapySessions.patientId, patientId),
      ),
    )
    .orderBy(desc(therapySessions.heldAt))
    .limit(1);

  return session ?? null;
}

export async function getRecordNote(recordId: string) {
  const [note] = await db
    .select()
    .from(recordNotes)
    .where(eq(recordNotes.recordId, recordId))
    .limit(1);

  return note;
}

export async function getPsychologistPatients(psychologistId: string) {
  const patients = await db
    .select({
      id: profiles.id,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      avatarUrl: profiles.avatarUrl,
      grammaticalGender: profiles.grammaticalGender,
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

  const latestRecords = patients.length
    ? await db
        .selectDistinctOn([patientRecords.patientId], {
          patientId: patientRecords.patientId,
          occurredAt: patientRecords.occurredAt,
          quadrant: patientRecords.quadrant,
          emotions: patientRecords.emotions,
        })
        .from(patientRecords)
        .where(
          inArray(
            patientRecords.patientId,
            patients.map((patient) => patient.id),
          ),
        )
        .orderBy(patientRecords.patientId, desc(patientRecords.occurredAt))
    : [];

  const latestMap = new Map(
    latestRecords.map(({ patientId, ...record }) => [patientId, record]),
  );

  return resolveAvatarUrls(
    patients.map((patient) => ({
      ...patient,
      unseenCount: unseenMap.get(patient.id) ?? 0,
      latestRecord: latestMap.get(patient.id) ?? null,
    })),
  );
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

export async function getProfileGrammaticalGender(profileId: string) {
  const [profile] = await db
    .select({ grammaticalGender: profiles.grammaticalGender })
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1);

  return profile?.grammaticalGender ?? "feminine";
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

export async function getPatientRecordsSince(patientId: string, since: Date) {
  return db
    .select({
      id: patientRecords.id,
      occurredAt: patientRecords.occurredAt,
      quadrant: patientRecords.quadrant,
      emotions: patientRecords.emotions,
    })
    .from(patientRecords)
    .where(
      and(
        eq(patientRecords.patientId, patientId),
        gte(patientRecords.occurredAt, since),
      ),
    )
    .orderBy(desc(patientRecords.occurredAt));
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

export async function getConnectionRequestForPair(
  patientId: string,
  psychologistId: string,
) {
  const [request] = await db
    .select({
      id: connectionRequests.id,
      status: connectionRequests.status,
      createdAt: connectionRequests.createdAt,
    })
    .from(connectionRequests)
    .where(
      and(
        eq(connectionRequests.patientId, patientId),
        eq(connectionRequests.psychologistId, psychologistId),
      ),
    )
    .limit(1);

  return request ?? null;
}
