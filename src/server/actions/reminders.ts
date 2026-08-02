"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { pushSubscriptions, userReminders } from "@/db/schema";
import { requireProfile } from "@/server/auth/get-current-profile";
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
      frequency: parsed.data.frequency,
      time: parsed.data.time,
      days: parsed.data.days,
    })
    .onConflictDoUpdate({
      target: userReminders.userId,
      set: {
        enabled: parsed.data.enabled,
        frequency: parsed.data.frequency,
        time: parsed.data.time,
        days: parsed.data.days,
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

export async function getReminderSettings(userId: string) {
  const [settings] = await db
    .select()
    .from(userReminders)
    .where(eq(userReminders.userId, userId))
    .limit(1);

  return settings ?? null;
}
