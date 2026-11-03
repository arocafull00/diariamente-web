"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { pushSubscriptions, userReminders } from "@/db/schema";
import { logAuditEvent } from "@/server/audit";
import { requireProfile, requireRole } from "@/server/auth/get-current-profile";
import { sendPushToUser } from "@/server/push/send-push";
import { getPatientPsychologist } from "@/server/queries";
import { pushSubscriptionSchema, reminderSchema } from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function saveReminderSettings(
  input: unknown,
): Promise<ActionResult> {
  const profile = await requireProfile();

  const parsed = reminderSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Algo no cuadra en los datos. Revísalos" };
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

export async function savePushSubscription(
  input: unknown,
): Promise<ActionResult> {
  const profile = await requireProfile();

  const parsed = pushSubscriptionSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Suscripción no válida" };
  }

  const { endpoint, keys } = parsed.data;

  await db
    .insert(pushSubscriptions)
    .values({
      userId: profile.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: {
        userId: profile.id,
        p256dh: keys.p256dh,
        auth: keys.auth,
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
    title: "¡Hola! ¿Qué tal te va?",
    body: "¿Te apetece registrar cómo te sientes hoy?",
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
