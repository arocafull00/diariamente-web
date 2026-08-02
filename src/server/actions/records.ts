"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { db } from "@/db";
import { customEmotions, patientRecords } from "@/db/schema";
import { getRecordIntensity } from "@/lib/intensity";
import { logAuditEvent } from "@/server/audit";
import { requireRecordAccess } from "@/server/auth/require-record-access";
import { requireRole } from "@/server/auth/get-current-profile";
import { sendPushToUser } from "@/server/push/send-push";
import { getPatientPsychologist } from "@/server/queries";
import {
  createRecordSchema,
  customEmotionSchema,
  updateRecordSchema,
} from "@/validation/schemas";

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

  return { success: true };
}

export async function markRecordAsSeen(recordId: string): Promise<ActionResult> {
  const { profile, record } = await requireRecordAccess(recordId);

  if (profile.role !== "psychologist") {
    return { error: "No autorizado" };
  }

  if (record.seenAt) {
    return { success: true };
  }

  await db
    .update(patientRecords)
    .set({ seenAt: new Date(), updatedAt: new Date() })
    .where(eq(patientRecords.id, record.id));

  await logAuditEvent({
    actorId: profile.id,
    action: "record.viewed_by_psychologist",
    entityType: "patient_record",
    entityId: record.id,
  });

  revalidatePath("/pacientes");
  revalidatePath(`/registro/${recordId}`);

  return { success: true };
}

export async function createCustomEmotion(name: string): Promise<ActionResult> {
  const profile = await requireRole("patient");

  const parsed = customEmotionSchema.safeParse({ name });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nombre inválido" };
  }

  try {
    await db.insert(customEmotions).values({
      userId: profile.id,
      name: parsed.data.name,
    });
  } catch {
    return { error: "Esta emoción ya existe" };
  }

  revalidatePath("/nuevo-registro");

  return { success: true };
}

export async function deleteCustomEmotion(emotionId: string): Promise<ActionResult> {
  const profile = await requireRole("patient");

  await db
    .delete(customEmotions)
    .where(
      and(
        eq(customEmotions.id, emotionId),
        eq(customEmotions.userId, profile.id),
      ),
    );

  revalidatePath("/nuevo-registro");

  return { success: true };
}
