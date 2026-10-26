"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { pushSubscriptions, userReminders } from "@/db/schema";
import { logAuditEvent } from "@/server/audit";
import { requireProfile, requireRole } from "@/server/auth/get-current-profile";
import { sendPushToUser } from "@/server/push/send-push";
import { getPatientPsychologist } from "@/server/queries";
import { reminderSchema } from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function saveReminderSettings(
  input: unknown,
): Promise<ActionResult> {
  const profile = await requireProfile();

  const parsed = reminderSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await db
    .insert(userReminders)
    .values({
      userId: profile.id,
      enabled: parsed.data.enabled,
    })
    .onConflictDoUpdate({
      target: userReminders.userId,
      set: {
        enabled: parsed.data.enabled,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/ajustes");

  return { success: true };
}

export async function savePushSubscription(input: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}): Promise<ActionResult> {
  const profile = await requireProfile();

  await db
    .insert(pushSubscriptions)
    .values({
      userId: profile.id,
      endpoint: input.endpoint,
      p256dh: input.keys.p256dh,
      auth: input.keys.auth,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: {
        userId: profile.id,
        p256dh: input.keys.p256dh,
        auth: input.keys.auth,
      },
    });

  return { success: true };
}

export async function sendPatientReminder(
  patientId: string,
): Promise<ActionResult> {
  const profile = await requireRole("psychologist");

  const relationship = await getPatientPsychologist(patientId);

  if (relationship?.psychologistId !== profile.id) {
    return { error: "No estás vinculado con este paciente" };
  }

  const delivered = await sendPushToUser(patientId, {
    topic: "reminder",
    title: "Hola, hace tiempo que no te conectas",
    body: "¿Quieres registrar alguna emoción del día?",
    url: "/nuevo-registro",
  });

  if (delivered === 0) {
    return {
      error: "Este paciente no tiene las notificaciones activadas",
    };
  }

  await logAuditEvent({
    actorId: profile.id,
    action: "patient.reminder_sent",
    entityType: "profile",
    entityId: patientId,
  });

  return { success: true };
}
