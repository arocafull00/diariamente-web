"use server";

import { and, eq, gt, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { invitations, psychologistPatient } from "@/db/schema";
import {
  generateInvitationCode,
  getInvitationExpiryDate,
} from "@/lib/invitations";
import { logAuditEvent } from "@/server/audit";
import { requireRole } from "@/server/auth/get-current-profile";
import { getPatientPsychologist } from "@/server/queries";
import { redeemInvitationSchema } from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function generateInvitation(): Promise<
  ActionResult & { code?: string }
> {
  const profile = await requireRole("psychologist");

  await db
    .update(invitations)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(invitations.psychologistId, profile.id),
        isNull(invitations.usedAt),
        isNull(invitations.revokedAt),
      ),
    );

  const code = generateInvitationCode();
  const expiresAt = getInvitationExpiryDate();

  await db.insert(invitations).values({
    code,
    psychologistId: profile.id,
    expiresAt,
  });

  revalidatePath("/invitacion");

  return { success: true, code };
}

export async function revokeInvitation(invitationId: string): Promise<ActionResult> {
  const profile = await requireRole("psychologist");

  await db
    .update(invitations)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(invitations.id, invitationId),
        eq(invitations.psychologistId, profile.id),
        isNull(invitations.usedAt),
      ),
    );

  revalidatePath("/invitacion");

  return { success: true };
}

export async function redeemInvitation(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const profile = await requireRole("patient");

  const parsed = redeemInvitationSchema.safeParse({
    code: formData.get("code"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Código inválido" };
  }

  const code = parsed.data.code.toUpperCase();

  const existingLink = await getPatientPsychologist(profile.id);

  if (existingLink) {
    return { error: "Ya estás vinculado con un psicólogo" };
  }

  const result = await db.transaction(async (tx) => {
    const [invitation] = await tx
      .update(invitations)
      .set({
        usedAt: new Date(),
        patientId: profile.id,
      })
      .where(
        and(
          eq(invitations.code, code),
          isNull(invitations.usedAt),
          isNull(invitations.revokedAt),
          gt(invitations.expiresAt, new Date()),
        ),
      )
      .returning();

    if (!invitation) {
      const [existing] = await tx
        .select()
        .from(invitations)
        .where(eq(invitations.code, code))
        .limit(1);

      if (!existing) {
        return { error: "Código inexistente" };
      }

      if (existing.revokedAt) {
        return { error: "Este código ha sido revocado" };
      }

      if (existing.usedAt) {
        return { error: "Este código ya ha sido utilizado" };
      }

      if (existing.expiresAt < new Date()) {
        return { error: "Este código ha caducado" };
      }

      return { error: "No se pudo utilizar el código" };
    }

    if (invitation.psychologistId === profile.id) {
      return { error: "No puedes usar tu propio código" };
    }

    try {
      await tx.insert(psychologistPatient).values({
        psychologistId: invitation.psychologistId,
        patientId: profile.id,
      });
    } catch {
      return { error: "Ya estás vinculado con un psicólogo" };
    }

    return { success: true as const, psychologistId: invitation.psychologistId };
  });

  if ("error" in result && result.error) {
    return { error: result.error };
  }

  await logAuditEvent({
    actorId: profile.id,
    action: "patient.linked",
    entityType: "psychologist_patient",
    entityId: profile.id,
    metadata: { psychologistId: result.psychologistId },
  });

  revalidatePath("/perfil");
  revalidatePath("/ajustes");

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

  return { success: true };
}

export async function unlinkFromPsychologistAction() {
  await unlinkFromPsychologist();
}
