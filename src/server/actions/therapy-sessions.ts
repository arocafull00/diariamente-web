"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { therapySessions } from "@/db/schema";
import { logAuditEvent } from "@/server/audit";
import { requireRole } from "@/server/auth/get-current-profile";
import { getPatientPsychologist } from "@/server/queries";

import type { ActionResult } from "./onboarding";

export async function markTherapySession(
  patientId: string,
): Promise<ActionResult> {
  const profile = await requireRole("psychologist");

  const relationship = await getPatientPsychologist(patientId);

  if (relationship?.psychologistId !== profile.id) {
    return { error: "No estás vinculado con este paciente" };
  }

  const [session] = await db
    .insert(therapySessions)
    .values({
      psychologistId: profile.id,
      patientId,
      heldAt: new Date(),
    })
    .returning({ id: therapySessions.id });

  await logAuditEvent({
    actorId: profile.id,
    action: "therapy_session.created",
    entityType: "therapy_session",
    entityId: session.id,
  });

  revalidatePath(`/pacientes/${patientId}`);

  return { success: true };
}
