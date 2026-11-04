"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { db } from "@/db";
import { recordReplies } from "@/db/schema";
import { getPsychologistNoun } from "@/lib/grammatical-gender";
import { logger } from "@/lib/logger";
import { logAuditEvent } from "@/server/audit";
import { requireRecordAccess } from "@/server/auth/require-record-access";
import { sendPushToUser } from "@/server/push/send-push";
import { recordReplySchema } from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function upsertRecordReply(
  recordId: string,
  input: unknown,
): Promise<ActionResult> {
  const { profile, record } = await requireRecordAccess(recordId);

  if (profile.role !== "psychologist") {
    return { error: "No tienes acceso a esto" };
  }

  const parsed = recordReplySchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Algo no cuadra en los datos. Revísalos" };
  }

  const [existingReply] = await db
    .select({ id: recordReplies.id })
    .from(recordReplies)
    .where(
      and(
        eq(recordReplies.recordId, record.id),
        eq(recordReplies.psychologistId, profile.id),
      ),
    )
    .limit(1);

  const [reply] = await db
    .insert(recordReplies)
    .values({
      recordId: record.id,
      psychologistId: profile.id,
      content: parsed.data.content,
    })
    .onConflictDoUpdate({
      target: [recordReplies.recordId, recordReplies.psychologistId],
      set: {
        content: parsed.data.content,
        seenAt: null,
        updatedAt: new Date(),
      },
    })
    .returning({ id: recordReplies.id });

  await logAuditEvent({
    actorId: profile.id,
    action: existingReply ? "record_reply.updated" : "record_reply.created",
    entityType: "record_reply",
    entityId: reply.id,
  });

  if (!existingReply) {
    after(async () => {
      try {
        await sendPushToUser(record.patientId, {
          topic: "record_reply",
          title: `Tu ${getPsychologistNoun(profile.grammaticalGender)} te ha respondido`,
          body: "Abre tu registro para leerlo cuando quieras.",
          url: `/registro/${record.id}`,
        });
      } catch (error) {
        logger.error("record_replies.notify_patient_failed", error, {
          recordId: record.id,
        });
      }
    });
  }

  revalidatePath(`/registro/${recordId}`);

  return { success: true };
}

export async function deleteRecordReply(recordId: string): Promise<ActionResult> {
  const { profile, record } = await requireRecordAccess(recordId);

  if (profile.role !== "psychologist") {
    return { error: "No tienes acceso a esto" };
  }

  const [deleted] = await db
    .delete(recordReplies)
    .where(
      and(
        eq(recordReplies.recordId, record.id),
        eq(recordReplies.psychologistId, profile.id),
      ),
    )
    .returning({ id: recordReplies.id });

  if (!deleted) {
    return { error: "Esta respuesta ya no existe" };
  }

  await logAuditEvent({
    actorId: profile.id,
    action: "record_reply.deleted",
    entityType: "record_reply",
    entityId: deleted.id,
  });

  revalidatePath(`/registro/${recordId}`);

  return { success: true };
}

export async function markRecordReplySeen(recordId: string): Promise<ActionResult> {
  const { profile, record } = await requireRecordAccess(recordId);

  if (profile.role !== "patient") {
    return { error: "No tienes acceso a esto" };
  }

  await db
    .update(recordReplies)
    .set({ seenAt: new Date() })
    .where(
      and(eq(recordReplies.recordId, record.id), isNull(recordReplies.seenAt)),
    );

  return { success: true };
}
