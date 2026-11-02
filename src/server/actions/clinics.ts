"use server";

import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { clinicInviteLinks, clinicPsychologists } from "@/db/schema";
import { CLINIC_INVITE_COOKIE_NAME } from "@/lib/clinic-invitations";
import { generateInviteToken } from "@/lib/invitations";
import { TRIAL_DAYS } from "@/lib/billing";
import { logger } from "@/lib/logger";
import { logAuditEvent } from "@/server/audit";
import { requireRoleProfile } from "@/server/auth/get-current-profile";
import { requireClinic } from "@/server/auth/require-clinic";
import { cancelSubscriptionAtPeriodEnd } from "@/server/billing/cancel-subscription";
import { extendTrial } from "@/server/billing/extend-trial";
import {
  getClinicInviteLinkByToken,
  getPsychologistClinic,
} from "@/server/queries";
import {
  clinicJoinConsentSchema,
  clinicPsychologistIdSchema,
} from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function generateClinicInviteLink(): Promise<ActionResult> {
  const { profile, clinic } = await requireClinic();

  const token = generateInviteToken();

  await db
    .insert(clinicInviteLinks)
    .values({ token, clinicId: clinic.id })
    .onConflictDoUpdate({
      target: clinicInviteLinks.clinicId,
      set: { token, createdAt: new Date() },
    });

  await logAuditEvent({
    actorId: profile.id,
    action: "clinic.invite_link_generated",
    entityType: "clinic",
    entityId: clinic.id,
  });

  revalidatePath("/clinica");

  return { success: true };
}

export async function joinClinic(
  input: unknown,
): Promise<ActionResult & { subscriptionCanceled?: boolean }> {
  const profile = await requireRoleProfile("psychologist");

  const parsed = clinicJoinConsentSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(CLINIC_INVITE_COOKIE_NAME)?.value;
  const link = token ? await getClinicInviteLinkByToken(token) : null;

  if (!link) {
    return { error: "El enlace de invitación no es válido" };
  }

  const existingClinic = await getPsychologistClinic(profile.id);

  if (existingClinic) {
    return { error: "Ya perteneces a una clínica" };
  }

  try {
    await db.insert(clinicPsychologists).values({
      clinicId: link.clinicId,
      psychologistId: profile.id,
      consentedAt: new Date(),
    });
  } catch (error) {
    logger.error("clinics.join_failed", error, {
      psychologistId: profile.id,
      clinicId: link.clinicId,
    });
    return { error: "No se pudo completar la unión a la clínica" };
  }

  await logAuditEvent({
    actorId: profile.id,
    action: "clinic.psychologist_joined",
    entityType: "clinic",
    entityId: link.clinicId,
  });

  cookieStore.delete(CLINIC_INVITE_COOKIE_NAME);

  const subscriptionCanceled = await cancelSubscriptionAtPeriodEnd(
    profile.id,
  ).catch((error: unknown) => {
    logger.error("billing.cancel_on_clinic_join_failed", error, {
      psychologistId: profile.id,
    });
    return false;
  });

  revalidatePath("/perfil");
  revalidatePath("/clinica");

  return { success: true, subscriptionCanceled };
}

export async function leaveClinic(): Promise<ActionResult> {
  const profile = await requireRoleProfile("psychologist");

  const [membership] = await db
    .delete(clinicPsychologists)
    .where(eq(clinicPsychologists.psychologistId, profile.id))
    .returning({ clinicId: clinicPsychologists.clinicId });

  if (!membership) {
    return { error: "No perteneces a ninguna clínica" };
  }

  await extendTrial(profile.id, TRIAL_DAYS);

  await logAuditEvent({
    actorId: profile.id,
    action: "clinic.psychologist_left",
    entityType: "clinic",
    entityId: membership.clinicId,
  });

  revalidatePath("/perfil");
  revalidatePath("/clinica");

  return { success: true };
}

export async function removeClinicPsychologist(
  psychologistId: string,
): Promise<ActionResult> {
  const { profile, clinic } = await requireClinic();

  const parsed = clinicPsychologistIdSchema.safeParse(psychologistId);

  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  const [membership] = await db
    .delete(clinicPsychologists)
    .where(
      and(
        eq(clinicPsychologists.clinicId, clinic.id),
        eq(clinicPsychologists.psychologistId, parsed.data),
      ),
    )
    .returning({ psychologistId: clinicPsychologists.psychologistId });

  if (!membership) {
    return { error: "Este psicólogo no pertenece a tu clínica" };
  }

  await extendTrial(membership.psychologistId, TRIAL_DAYS);

  await logAuditEvent({
    actorId: profile.id,
    action: "clinic.psychologist_removed",
    entityType: "clinic",
    entityId: clinic.id,
    metadata: { psychologistId: membership.psychologistId },
  });

  revalidatePath("/clinica");
  revalidatePath(`/clinica/psicologos/${membership.psychologistId}`);

  return { success: true };
}
