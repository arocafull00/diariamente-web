"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { feedback, profiles } from "@/db/schema";
import { logAuditEvent } from "@/server/audit";
import { requireProfile, requireRole } from "@/server/auth/get-current-profile";
import { notifyFeedback } from "@/server/feedback/notify-feedback";
import { feedbackEaseSchema, submitFeedbackSchema } from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function submitFeedback(input: unknown): Promise<ActionResult> {
  const profile = await requireProfile();
  const parsed = submitFeedbackSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const wantsCall = profile.role === "psychologist" && parsed.data.wantsCall;

  const [created] = await db
    .insert(feedback)
    .values({
      profileId: profile.id,
      role: profile.role!,
      trigger: parsed.data.trigger,
      kind: parsed.data.kind,
      message: parsed.data.message,
      wantsCall,
      clientContext: parsed.data.clientContext,
    })
    .returning({ id: feedback.id });

  await logAuditEvent({
    actorId: profile.id,
    action: "feedback.created",
    entityType: "feedback",
    entityId: created.id,
  });

  await notifyFeedback({
    role: profile.role!,
    trigger: parsed.data.trigger,
    kind: parsed.data.kind,
    ease: null,
    wantsCall,
  });

  return { success: true };
}

export async function submitFeedbackEase(input: unknown): Promise<ActionResult> {
  const profile = await requireRole("patient");
  const parsed = feedbackEaseSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const [created] = await db
    .insert(feedback)
    .values({
      profileId: profile.id,
      role: "patient",
      trigger: "streak",
      ease: parsed.data.ease,
      clientContext: parsed.data.clientContext,
    })
    .returning({ id: feedback.id });

  await db
    .update(profiles)
    .set({ feedbackPromptedAt: new Date() })
    .where(eq(profiles.id, profile.id));

  await logAuditEvent({
    actorId: profile.id,
    action: "feedback.created",
    entityType: "feedback",
    entityId: created.id,
  });

  await notifyFeedback({
    role: "patient",
    trigger: "streak",
    kind: null,
    ease: parsed.data.ease,
    wantsCall: false,
  });

  revalidatePath("/inicio");

  return { success: true };
}

export async function dismissFeedbackPrompt(): Promise<ActionResult> {
  const profile = await requireRole("patient");

  await db
    .update(profiles)
    .set({ feedbackPromptedAt: new Date() })
    .where(eq(profiles.id, profile.id));

  revalidatePath("/inicio");

  return { success: true };
}
