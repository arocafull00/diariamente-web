import { clerkClient } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { auditEvents, profiles } from "@/db/schema";
import { cancelSubscriptionNow } from "@/server/billing/cancel-subscription";

async function ignoreMissingIdentity(operation: Promise<unknown>) {
  try {
    await operation;
  } catch (error) {
    if (!isClerkAPIResponseError(error) || error.status !== 404) throw error;
  }
}

export async function deleteProfileAndIdentity(
  userId: string,
  { revokeSessions = false } = {},
) {
  const client = await clerkClient();
  await cancelSubscriptionNow(userId);
  if (revokeSessions) await ignoreMissingIdentity(client.users.banUser(userId));

  await db.batch([
    db.select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .for("update"),
    db.delete(auditEvents).where(sql`
      ${auditEvents.entityId} = ${userId}
      or ${auditEvents.metadata}->>'patientId' = ${userId}
      or ${auditEvents.metadata}->>'psychologistId' = ${userId}
      or ${auditEvents.entityId} in (
        select id::text from patient_records where patient_id = ${userId}
        union all
        select notes.id::text from record_notes notes
          join patient_records records on records.id = notes.record_id
          where records.patient_id = ${userId} or notes.psychologist_id = ${userId}
        union all
        select id::text from connection_requests
          where patient_id = ${userId} or psychologist_id = ${userId}
        union all
        select id::text from therapy_sessions
          where patient_id = ${userId} or psychologist_id = ${userId}
        union all
        select id::text from clinics where owner_id = ${userId}
        union all
        select id::text from referrals
          where referred_id = ${userId} or referrer_id = ${userId}
      )
    `),
    db.delete(profiles).where(eq(profiles.id, userId)),
  ]);

  await ignoreMissingIdentity(client.users.deleteUser(userId));
}
