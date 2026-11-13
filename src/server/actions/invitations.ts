"use server";

import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { db } from "@/db";
import { inviteLinks, psychologistPatient } from "@/db/schema";
import {
  generateInviteCode,
  generateInviteToken,
  INVITE_COOKIE_MAX_AGE_SECONDS,
  INVITE_COOKIE_NAME,
} from "@/lib/invitations";
import { logger } from "@/lib/logger";
import { CONSENT_VERSION } from "@/lib/privacy";
import { logAuditEvent } from "@/server/audit";
import { requireRole } from "@/server/auth/get-current-profile";
import { sendPushToUser } from "@/server/push/send-push";
import {
  getInviteLinkByCode,
  getInviteLinkByToken,
  getPatientPsychologist,
} from "@/server/queries";
import { connectionConsentSchema, inviteCodeSchema } from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function generateInviteLink(): Promise<ActionResult> {
  const profile = await requireRole("psychologist");

  const token = generateInviteToken();
  const code = generateInviteCode();

  await db
    .insert(inviteLinks)
    .values({ token, code, psychologistId: profile.id })
    .onConflictDoUpdate({
      target: inviteLinks.psychologistId,
      set: { token, code, createdAt: new Date() },
    });

  await logAuditEvent({
    actorId: profile.id,
    action: "invitation.link_generated",
    entityType: "invite_link",
    entityId: profile.id,
  });

  revalidatePath("/pacientes");

  return { success: true };
}

export async function openInviteCode(input: unknown): Promise<ActionResult> {
  await requireRole("patient");

  const parsed = inviteCodeSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa el código" };
  }

  const link = await getInviteLinkByCode(parsed.data.code);

  if (!link) {
    return { error: "Ese código no existe. Revísalo con tu psicólogo/a" };
  }

  const cookieStore = await cookies();
  cookieStore.set(INVITE_COOKIE_NAME, link.token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: INVITE_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  return { success: true };
}

export async function connectWithPsychologist(
  input: unknown,
): Promise<ActionResult> {
  const profile = await requireRole("patient");

  const parsed = connectionConsentSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Algo no cuadra en los datos. Revísalos" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(INVITE_COOKIE_NAME)?.value;

  if (!token) {
    return { error: "Este enlace ya no funciona" };
  }

  const link = await getInviteLinkByToken(token);

  if (!link) {
    return { error: "Este enlace ya no funciona" };
  }

  const existingLink = await getPatientPsychologist(profile.id);

  if (existingLink) {
    return { error: "¡Ya tienes psicólogo/a!" };
  }

  try {
    await db.insert(psychologistPatient).values({
      psychologistId: link.psychologistId,
      patientId: profile.id,
    });
  } catch (error) {
    logger.warn("invitations.link_conflict", {
      psychologistId: link.psychologistId,
      patientId: profile.id,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return { error: "¡Ya tienes psicólogo/a!" };
  }

  await logAuditEvent({
    actorId: profile.id,
    action: "connection.linked",
    entityType: "psychologist_patient",
    entityId: profile.id,
    metadata: {
      psychologistId: link.psychologistId,
      consentVersion: CONSENT_VERSION,
    },
  });

  cookieStore.delete(INVITE_COOKIE_NAME);

  after(() =>
    sendPushToUser(link.psychologistId, {
      topic: "patient_linked",
      title: "¡Nuevo paciente!",
      body: "Un paciente se ha conectado contigo.",
      url: "/pacientes",
    }),
  );

  revalidatePath("/conectar");
  revalidatePath("/perfil");
  revalidatePath("/pacientes");

  return { success: true };
}

export async function unlinkFromPsychologist(): Promise<ActionResult> {
  const profile = await requireRole("patient");

  const link = await getPatientPsychologist(profile.id);

  if (!link) {
    return { error: "No tienes un psicólogo vinculado" };
  }

  await db
    .delete(psychologistPatient)
    .where(eq(psychologistPatient.patientId, profile.id));

  await logAuditEvent({
    actorId: profile.id,
    action: "patient.unlinked",
    entityType: "psychologist_patient",
    entityId: profile.id,
    metadata: { psychologistId: link.psychologistId },
  });

  revalidatePath("/perfil");
  revalidatePath("/ajustes");
  revalidatePath("/conectar");

  return { success: true };
}

export async function unlinkPatient(patientId: string): Promise<ActionResult> {
  const profile = await requireRole("psychologist");

  const [relationship] = await db
    .select({ patientId: psychologistPatient.patientId })
    .from(psychologistPatient)
    .where(
      and(
        eq(psychologistPatient.patientId, patientId),
        eq(psychologistPatient.psychologistId, profile.id),
      ),
    )
    .limit(1);

  if (!relationship) {
    return { error: "No estás vinculado con este paciente" };
  }

  await db
    .delete(psychologistPatient)
    .where(
      and(
        eq(psychologistPatient.patientId, patientId),
        eq(psychologistPatient.psychologistId, profile.id),
      ),
    );

  await logAuditEvent({
    actorId: profile.id,
    action: "psychologist.unlinked",
    entityType: "psychologist_patient",
    entityId: patientId,
  });

  revalidatePath("/pacientes");
  revalidatePath(`/pacientes/${patientId}`);
  revalidatePath("/perfil");
  revalidatePath("/conectar");

  return { success: true };
}

export async function unlinkFromPsychologistAction() {
  await unlinkFromPsychologist();
}
