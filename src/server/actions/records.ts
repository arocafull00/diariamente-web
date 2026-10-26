"use server";

import { and, eq, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { db } from "@/db";
import { auditEvents, patientRecords } from "@/db/schema";
import { getRecordIntensity } from "@/lib/intensity";
import {
  RECORD_VIEW_ACTION,
  RECORD_VIEW_DEDUPE_MINUTES,
} from "@/lib/privacy";
import { logAuditEvent } from "@/server/audit";
import { requireRecordAccess } from "@/server/auth/require-record-access";
import { requireRole } from "@/server/auth/get-current-profile";
import { sendPushToUser } from "@/server/push/send-push";
import { getPatientPsychologist } from "@/server/queries";
import { createRecordSchema, updateRecordSchema } from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function createPatientRecord(
  input: unknown,
): Promise<ActionResult & { recordId?: string }> {
  const profile = await requireRole("patient");

  const parsed = createRecordSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const emotionIntensity = getRecordIntensity(parsed.data.emotions);

  const [record] = await db
    .insert(patientRecords)
    .values({
      patientId: profile.id,
      occurredAt: parsed.data.occurredAt,
      situation: parsed.data.situation,
      thoughts: parsed.data.thoughts,
      behaviours: parsed.data.behaviours,
      emotions: parsed.data.emotions,
      quadrant: parsed.data.quadrant,
      context: parsed.data.context,
      bodySensations: parsed.data.bodySensations,
      emotionIntensity,
    })
    .returning({ id: patientRecords.id });

  await logAuditEvent({
    actorId: profile.id,
    action: "record.created",
    entityType: "patient_record",
    entityId: record.id,
  });

  after(async () => {
    const link = await getPatientPsychologist(profile.id);

    if (!link) {
      return;
    }

    await sendPushToUser(link.psychologistId, {
      topic: "patient_record",
      title: "Nuevo registro",
      body: "Un paciente ha añadido un registro nuevo.",
      url: `/pacientes/${profile.id}`,
    });
  });

  revalidatePath("/mis-registros");
  revalidatePath("/inicio");

  return { success: true, recordId: record.id };
}

export async function updatePatientRecord(
  recordId: string,
  input: unknown,
): Promise<ActionResult> {
  const { profile, record } = await requireRecordAccess(recordId);

  if (profile.role !== "patient") {
    return { error: "No tienes permiso para editar este registro" };
  }

  const parsed = updateRecordSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await db
    .update(patientRecords)
    .set({
      situation: parsed.data.situation,
      thoughts: parsed.data.thoughts,
      behaviours: parsed.data.behaviours,
      updatedAt: new Date(),
    })
    .where(eq(patientRecords.id, record.id));

  await logAuditEvent({
    actorId: profile.id,
    action: "record.updated",
    entityType: "patient_record",
    entityId: record.id,
  });

  revalidatePath(`/registro/${recordId}`);
  revalidatePath("/mis-registros");
  revalidatePath("/inicio");

  return { success: true };
}

export async function markRecordAsSeen(recordId: string): Promise<ActionResult> {
  const { profile, record } = await requireRecordAccess(recordId);

  if (profile.role !== "psychologist") {
    return { error: "No autorizado" };
  }

  const [recentView] = await db
    .select({ id: auditEvents.id })
    .from(auditEvents)
    .where(
      and(
        eq(auditEvents.actorId, profile.id),
        eq(auditEvents.action, RECORD_VIEW_ACTION),
        eq(auditEvents.entityId, record.id),
        gte(
          auditEvents.createdAt,
          new Date(Date.now() - RECORD_VIEW_DEDUPE_MINUTES * 60 * 1000),
        ),
      ),
    )
    .limit(1);

  if (!recentView) {
    await logAuditEvent({
      actorId: profile.id,
      action: RECORD_VIEW_ACTION,
      entityType: "patient_record",
      entityId: record.id,
      metadata: { patientId: record.patientId },
    });
  }

  if (record.seenAt) {
    return { success: true };
  }

  await db
    .update(patientRecords)
    .set({ seenAt: new Date(), updatedAt: new Date() })
    .where(eq(patientRecords.id, record.id));

  revalidatePath("/pacientes");
  revalidatePath(`/registro/${recordId}`);

  return { success: true };
}
