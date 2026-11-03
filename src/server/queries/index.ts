import { subDays } from "date-fns";
import {
  and,
  count,
  desc,
  eq,
  gte,
  inArray,
  isNull,
  lt,
  notExists,
  or,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import { RECORD_VIEW_ACTION } from "@/lib/privacy";
import { resolveAvatarUrls } from "@/server/profiles/resolve-avatar-urls";
import {
  auditEvents,
  clinicInviteLinks,
  clinicPsychologists,
  clinics,
  connectionRequests,
  customEmotions,
  inviteLinks,
  onboardingAnswers,
  patientRecords,
  profiles,
  psychologistPatient,
  recordNotes,
  referrals,
  screenAcknowledgements,
  subscriptions,
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

export async function getRecordNote(recordId: string, psychologistId: string) {
  const [note] = await db
    .select()
    .from(recordNotes)
    .where(
      and(
        eq(recordNotes.recordId, recordId),
        eq(recordNotes.psychologistId, psychologistId),
      ),
    )
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

export async function getRecordAccessLog(patientId: string) {
  return db
    .select({
      id: auditEvents.id,
      viewedAt: auditEvents.createdAt,
      recordId: patientRecords.id,
      recordOccurredAt: patientRecords.occurredAt,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      grammaticalGender: profiles.grammaticalGender,
    })
    .from(auditEvents)
    .innerJoin(
      patientRecords,
      eq(sql`${patientRecords.id}::text`, auditEvents.entityId),
    )
    .innerJoin(profiles, eq(profiles.id, auditEvents.actorId))
    .where(
      and(
        eq(auditEvents.action, RECORD_VIEW_ACTION),
        eq(patientRecords.patientId, patientId),
      ),
    )
    .orderBy(desc(auditEvents.createdAt));
}

export async function getRecordViews(recordId: string) {
  return db
    .select({
      id: auditEvents.id,
      viewedAt: auditEvents.createdAt,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      grammaticalGender: profiles.grammaticalGender,
    })
    .from(auditEvents)
    .innerJoin(profiles, eq(profiles.id, auditEvents.actorId))
    .where(
      and(
        eq(auditEvents.action, RECORD_VIEW_ACTION),
        eq(auditEvents.entityId, recordId),
      ),
    )
    .orderBy(desc(auditEvents.createdAt));
}

export async function getDataExport(profileId: string) {
  const [
    profile,
    records,
    emotions,
    reminders,
    links,
    requests,
    sessions,
    notes,
    accessLog,
    activity,
    onboarding,
  ] = await Promise.all([
    db
      .select()
      .from(profiles)
      .where(eq(profiles.id, profileId))
      .limit(1)
      .then(([row]) => row ?? null),
    getPatientRecords(profileId),
    db
      .select({
        name: customEmotions.name,
        quadrant: customEmotions.quadrant,
        createdAt: customEmotions.createdAt,
      })
      .from(customEmotions)
      .where(eq(customEmotions.userId, profileId)),
    getReminderSettings(profileId),
    db
      .select({
        psychologistId: psychologistPatient.psychologistId,
        patientId: psychologistPatient.patientId,
        linkedAt: psychologistPatient.linkedAt,
      })
      .from(psychologistPatient)
      .where(
        or(
          eq(psychologistPatient.patientId, profileId),
          eq(psychologistPatient.psychologistId, profileId),
        ),
      ),
    db
      .select({
        psychologistId: connectionRequests.psychologistId,
        patientId: connectionRequests.patientId,
        status: connectionRequests.status,
        createdAt: connectionRequests.createdAt,
        resolvedAt: connectionRequests.resolvedAt,
        consentedAt: connectionRequests.consentedAt,
      })
      .from(connectionRequests)
      .where(
        or(
          eq(connectionRequests.patientId, profileId),
          eq(connectionRequests.psychologistId, profileId),
        ),
      ),
    db
      .select({
        psychologistId: therapySessions.psychologistId,
        patientId: therapySessions.patientId,
        heldAt: therapySessions.heldAt,
      })
      .from(therapySessions)
      .where(
        or(
          eq(therapySessions.patientId, profileId),
          eq(therapySessions.psychologistId, profileId),
        ),
      )
      .orderBy(desc(therapySessions.heldAt)),
    db
      .select({
        recordId: recordNotes.recordId,
        content: recordNotes.content,
        createdAt: recordNotes.createdAt,
        updatedAt: recordNotes.updatedAt,
      })
      .from(recordNotes)
      .where(eq(recordNotes.psychologistId, profileId)),
    getRecordAccessLog(profileId),
    db
      .select({ action: auditEvents.action, createdAt: auditEvents.createdAt })
      .from(auditEvents)
      .where(eq(auditEvents.actorId, profileId))
      .orderBy(desc(auditEvents.createdAt)),
    db
      .select({
        acquisitionSource: onboardingAnswers.acquisitionSource,
        goal: onboardingAnswers.goal,
        therapyStatus: onboardingAnswers.therapyStatus,
        recordsExperience: onboardingAnswers.recordsExperience,
        caseload: onboardingAnswers.caseload,
      })
      .from(onboardingAnswers)
      .where(eq(onboardingAnswers.profileId, profileId))
      .limit(1)
      .then(([row]) => row ?? null),
  ]);

  const counterpartIds = [
    ...new Set(
      [...links, ...requests, ...sessions].map((item) =>
        item.patientId === profileId ? item.psychologistId : item.patientId,
      ),
    ),
  ];
  const counterparts =
    counterpartIds.length > 0
      ? await db
          .select({
            id: profiles.id,
            firstName: profiles.firstName,
            lastName: profiles.lastName,
          })
          .from(profiles)
          .where(inArray(profiles.id, counterpartIds))
      : [];
  const counterpartNames = new Map(
    counterparts.map((item) => [
      item.id,
      [item.firstName, item.lastName].filter(Boolean).join(" "),
    ]),
  );

  function withCounterpart<T extends { psychologistId: string; patientId: string }>(
    items: T[],
  ) {
    return items.map(({ psychologistId, patientId, ...item }) => {
      const counterpartId = patientId === profileId ? psychologistId : patientId;

      return { ...item, with: counterpartNames.get(counterpartId) ?? "" };
    });
  }

  return {
    exportedAt: new Date(),
    profile: profile && {
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.role,
      grammaticalGender: profile.grammaticalGender,
      bodyFigure: profile.bodyFigure,
      avatarUrl: profile.avatarUrl,
      createdAt: profile.createdAt,
      lastActiveAt: profile.lastActiveAt,
    },
    records,
    customEmotions: emotions,
    reminders: { enabled: reminders?.enabled ?? false },
    links: withCounterpart(links),
    connectionRequests: withCounterpart(requests),
    therapySessions: withCounterpart(sessions),
    recordNotes: notes,
    accessLog,
    activity,
    onboarding,
  };
}

export async function getTherapyStatus(profileId: string) {
  const [answers] = await db
    .select({ therapyStatus: onboardingAnswers.therapyStatus })
    .from(onboardingAnswers)
    .where(eq(onboardingAnswers.profileId, profileId))
    .limit(1);

  return answers?.therapyStatus ?? null;
}

export async function getScreenAcknowledgements(profileId: string) {
  return db
    .select({
      screen: screenAcknowledgements.screen,
      version: screenAcknowledgements.version,
    })
    .from(screenAcknowledgements)
    .where(eq(screenAcknowledgements.profileId, profileId));
}

export async function getClinicByOwner(ownerId: string) {
  const [clinic] = await db
    .select()
    .from(clinics)
    .where(eq(clinics.ownerId, ownerId))
    .limit(1);

  return clinic ?? null;
}

export async function getClinicInviteLink(clinicId: string) {
  const [link] = await db
    .select()
    .from(clinicInviteLinks)
    .where(eq(clinicInviteLinks.clinicId, clinicId))
    .limit(1);

  return link ?? null;
}

export async function getClinicInviteLinkByToken(token: string) {
  const [link] = await db
    .select({
      clinicId: clinicInviteLinks.clinicId,
      clinicName: clinics.name,
    })
    .from(clinicInviteLinks)
    .innerJoin(clinics, eq(clinics.id, clinicInviteLinks.clinicId))
    .where(eq(clinicInviteLinks.token, token))
    .limit(1);

  return link ?? null;
}

export async function getReferralCodeOwner(code: string) {
  const [owner] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(and(eq(profiles.referralCode, code), eq(profiles.role, "psychologist")))
    .limit(1);

  return owner ?? null;
}

export async function getReferrer(referredId: string) {
  const [referrer] = await db
    .select({ firstName: profiles.firstName, lastName: profiles.lastName })
    .from(referrals)
    .innerJoin(profiles, eq(profiles.id, referrals.referrerId))
    .where(eq(referrals.referredId, referredId))
    .limit(1);

  return referrer ?? null;
}

export async function getReferralStats(referrerId: string) {
  const [stats] = await db
    .select({
      joined: count(),
      rewarded: count(referrals.rewardedAt),
    })
    .from(referrals)
    .where(eq(referrals.referrerId, referrerId));

  return stats ?? { joined: 0, rewarded: 0 };
}

export async function getPsychologistClinic(psychologistId: string) {
  const [membership] = await db
    .select({
      clinicId: clinicPsychologists.clinicId,
      name: clinics.name,
      joinedAt: clinicPsychologists.joinedAt,
    })
    .from(clinicPsychologists)
    .innerJoin(clinics, eq(clinics.id, clinicPsychologists.clinicId))
    .where(eq(clinicPsychologists.psychologistId, psychologistId))
    .limit(1);

  return membership ?? null;
}

export async function getBillingSnapshot(profileId: string) {
  const [[account], [ownClinic], [memberClinic]] = await Promise.all([
    db
      .select({
        id: profiles.id,
        role: profiles.role,
        lifetimeAccess: profiles.lifetimeAccess,
        trialEndsAt: profiles.trialEndsAt,
        stripeCustomerId: profiles.stripeCustomerId,
        subscriptionId: subscriptions.stripeSubscriptionId,
        subscriptionStatus: subscriptions.status,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
        cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
      })
      .from(profiles)
      .leftJoin(subscriptions, eq(subscriptions.profileId, profiles.id))
      .where(eq(profiles.id, profileId))
      .limit(1),
    db
      .select({
        id: clinics.id,
        name: clinics.name,
        stripePriceId: clinics.stripePriceId,
        monthlyPriceCents: clinics.monthlyPriceCents,
      })
      .from(clinics)
      .where(eq(clinics.ownerId, profileId))
      .limit(1),
    db
      .select({
        name: clinics.name,
        ownerRole: profiles.role,
        ownerLifetimeAccess: profiles.lifetimeAccess,
        ownerTrialEndsAt: profiles.trialEndsAt,
        ownerSubscriptionStatus: subscriptions.status,
      })
      .from(clinicPsychologists)
      .innerJoin(clinics, eq(clinics.id, clinicPsychologists.clinicId))
      .innerJoin(profiles, eq(profiles.id, clinics.ownerId))
      .leftJoin(subscriptions, eq(subscriptions.profileId, clinics.ownerId))
      .where(eq(clinicPsychologists.psychologistId, profileId))
      .limit(1),
  ]);

  if (!account) {
    return null;
  }

  return {
    account,
    ownClinic: ownClinic ?? null,
    memberClinic: memberClinic ?? null,
  };
}

export async function getClinicPsychologistCount(clinicId: string) {
  const [result] = await db
    .select({ value: count() })
    .from(clinicPsychologists)
    .where(eq(clinicPsychologists.clinicId, clinicId));

  return result?.value ?? 0;
}

const INACTIVE_PATIENT_DAYS = 14;

export async function getClinicPsychologistStats(
  clinicId: string,
  psychologistId?: string,
) {
  const now = new Date();
  const since7 = subDays(now, 7).toISOString();
  const since30 = subDays(now, 30);
  const inactiveSince = subDays(now, INACTIVE_PATIENT_DAYS);

  const members = await db
    .select({
      id: profiles.id,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      avatarUrl: profiles.avatarUrl,
      grammaticalGender: profiles.grammaticalGender,
      lastActiveAt: profiles.lastActiveAt,
      joinedAt: clinicPsychologists.joinedAt,
    })
    .from(clinicPsychologists)
    .innerJoin(profiles, eq(profiles.id, clinicPsychologists.psychologistId))
    .where(
      and(
        eq(clinicPsychologists.clinicId, clinicId),
        psychologistId
          ? eq(clinicPsychologists.psychologistId, psychologistId)
          : undefined,
      ),
    )
    .orderBy(desc(clinicPsychologists.joinedAt));

  if (members.length === 0) {
    return [];
  }

  const ids = members.map((member) => member.id);

  const [patientCounts, recordCounts, sessionCounts, inactiveCounts] =
    await Promise.all([
      db
        .select({
          psychologistId: psychologistPatient.psychologistId,
          patients: count(),
          newPatients: sql<number>`count(*) filter (where ${psychologistPatient.linkedAt} >= ${since30.toISOString()})`.mapWith(
            Number,
          ),
        })
        .from(psychologistPatient)
        .where(inArray(psychologistPatient.psychologistId, ids))
        .groupBy(psychologistPatient.psychologistId),
      db
        .select({
          psychologistId: psychologistPatient.psychologistId,
          records7d: sql<number>`count(*) filter (where ${patientRecords.createdAt} >= ${since7})`.mapWith(
            Number,
          ),
          records30d: sql<number>`count(*) filter (where ${patientRecords.createdAt} >= ${since30.toISOString()})`.mapWith(
            Number,
          ),
          reviewed30d: sql<number>`count(*) filter (where ${patientRecords.seenAt} >= ${since30.toISOString()})`.mapWith(
            Number,
          ),
        })
        .from(patientRecords)
        .innerJoin(
          psychologistPatient,
          eq(patientRecords.patientId, psychologistPatient.patientId),
        )
        .where(
          and(
            inArray(psychologistPatient.psychologistId, ids),
            or(
              gte(patientRecords.createdAt, since30),
              gte(patientRecords.seenAt, since30),
            ),
          ),
        )
        .groupBy(psychologistPatient.psychologistId),
      db
        .select({
          psychologistId: therapySessions.psychologistId,
          sessions30d: count(),
        })
        .from(therapySessions)
        .where(
          and(
            inArray(therapySessions.psychologistId, ids),
            gte(therapySessions.heldAt, since30),
          ),
        )
        .groupBy(therapySessions.psychologistId),
      db
        .select({
          psychologistId: psychologistPatient.psychologistId,
          inactivePatients: count(),
        })
        .from(psychologistPatient)
        .where(
          and(
            inArray(psychologistPatient.psychologistId, ids),
            lt(psychologistPatient.linkedAt, inactiveSince),
            notExists(
              db
                .select({ id: patientRecords.id })
                .from(patientRecords)
                .where(
                  and(
                    eq(patientRecords.patientId, psychologistPatient.patientId),
                    gte(patientRecords.createdAt, inactiveSince),
                  ),
                ),
            ),
          ),
        )
        .groupBy(psychologistPatient.psychologistId),
    ]);

  const patientMap = new Map(
    patientCounts.map((item) => [item.psychologistId, item]),
  );
  const recordMap = new Map(
    recordCounts.map((item) => [item.psychologistId, item]),
  );
  const sessionMap = new Map(
    sessionCounts.map((item) => [item.psychologistId, item.sessions30d]),
  );
  const inactiveMap = new Map(
    inactiveCounts.map((item) => [item.psychologistId, item.inactivePatients]),
  );

  return resolveAvatarUrls(
    members.map((member) => ({
      ...member,
      patients: Number(patientMap.get(member.id)?.patients ?? 0),
      newPatients: patientMap.get(member.id)?.newPatients ?? 0,
      records7d: recordMap.get(member.id)?.records7d ?? 0,
      records30d: recordMap.get(member.id)?.records30d ?? 0,
      reviewed30d: recordMap.get(member.id)?.reviewed30d ?? 0,
      sessions30d: Number(sessionMap.get(member.id) ?? 0),
      inactivePatients: Number(inactiveMap.get(member.id) ?? 0),
    })),
  );
}
