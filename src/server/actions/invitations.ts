"use server";

import { and, eq, ne } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { db } from "@/db";
import { connectionRequests, inviteLinks, psychologistPatient } from "@/db/schema";
import {
  generateInviteToken,
  INVITE_COOKIE_NAME,
} from "@/lib/invitations";
import { logAuditEvent } from "@/server/audit";
import { requireRole } from "@/server/auth/get-current-profile";
import { sendPushToUser } from "@/server/push/send-push";
import {
  getConnectionRequestForPair,
  getInviteLinkByToken,
  getPatientPsychologist,
} from "@/server/queries";

import type { ActionResult } from "./onboarding";

export async function generateInviteLink(): Promise<ActionResult> {
  const profile = await requireRole("psychologist");

  const token = generateInviteToken();

  await db
    .insert(inviteLinks)
    .values({ token, psychologistId: profile.id })
    .onConflictDoUpdate({
      target: inviteLinks.psychologistId,
      set: { token, createdAt: new Date() },
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

export async function requestConnection(): Promise<ActionResult> {
  const profile = await requireRole("patient");

  const cookieStore = await cookies();
  const token = cookieStore.get(INVITE_COOKIE_NAME)?.value;

  if (!token) {
    return { error: "El enlace de invitación no es válido" };
  }

  const link = await getInviteLinkByToken(token);

  if (!link) {
    return { error: "El enlace de invitación no es válido" };
  }

  const existingLink = await getPatientPsychologist(profile.id);

  if (existingLink) {
    return { error: "Ya estás vinculado con un psicólogo" };
  }

  const existingRequest = await getConnectionRequestForPair(
    profile.id,
    link.psychologistId,
  );

  if (existingRequest?.status === "pending") {
    return { error: "Ya tienes una solicitud de conexión pendiente" };
  }

  if (existingRequest) {
    await db
      .update(connectionRequests)
      .set({ status: "pending", resolvedAt: null, createdAt: new Date() })
      .where(eq(connectionRequests.id, existingRequest.id));
  } else {
    try {
      await db.insert(connectionRequests).values({
        psychologistId: link.psychologistId,
        patientId: profile.id,
      });
    } catch {
      return { error: "No se pudo enviar la solicitud" };
    }
  }

  await logAuditEvent({
    actorId: profile.id,
    action: "connection.requested",
    entityType: "connection_request",
    metadata: { psychologistId: link.psychologistId },
  });

  cookieStore.delete(INVITE_COOKIE_NAME);

  after(() =>
    sendPushToUser(link.psychologistId, {
      topic: "connection_request",
      title: "Nueva solicitud de conexión",
      body: "Tienes una solicitud pendiente de revisar.",
      url: "/pacientes",
    }),
  );

  revalidatePath("/conectar");
  revalidatePath("/perfil");

  return { success: true };
}

export async function cancelConnectionRequest(
  requestId: string,
): Promise<ActionResult> {
  const profile = await requireRole("patient");

  await db
    .update(connectionRequests)
    .set({ status: "rejected", resolvedAt: new Date() })
    .where(
      and(
        eq(connectionRequests.id, requestId),
        eq(connectionRequests.patientId, profile.id),
        eq(connectionRequests.status, "pending"),
      ),
    );

  revalidatePath("/perfil");

  return { success: true };
}

export async function acceptConnectionRequest(
  requestId: string,
): Promise<ActionResult> {
  const profile = await requireRole("psychologist");

  const [request] = await db
    .select()
    .from(connectionRequests)
    .where(
      and(
        eq(connectionRequests.id, requestId),
        eq(connectionRequests.psychologistId, profile.id),
        eq(connectionRequests.status, "pending"),
      ),
    )
    .limit(1);

  if (!request) {
    return { error: "La solicitud ya no está disponible" };
  }

  const existingLink = await getPatientPsychologist(request.patientId);

  if (existingLink) {
    await db
      .update(connectionRequests)
      .set({ status: "rejected", resolvedAt: new Date() })
      .where(eq(connectionRequests.id, requestId));

    return { error: "El paciente ya está vinculado con otro psicólogo" };
  }

  try {
    await db.insert(psychologistPatient).values({
      psychologistId: profile.id,
      patientId: request.patientId,
    });
  } catch {
    return { error: "El paciente ya está vinculado con otro psicólogo" };
  }

  await db
    .update(connectionRequests)
    .set({ status: "accepted", resolvedAt: new Date() })
    .where(eq(connectionRequests.id, requestId));

  await db
    .update(connectionRequests)
    .set({ status: "rejected", resolvedAt: new Date() })
    .where(
      and(
        eq(connectionRequests.patientId, request.patientId),
        eq(connectionRequests.status, "pending"),
        ne(connectionRequests.id, requestId),
      ),
    );

  await logAuditEvent({
    actorId: profile.id,
    action: "connection.accepted",
    entityType: "psychologist_patient",
    entityId: request.patientId,
  });

  after(() =>
    sendPushToUser(request.patientId, {
      topic: "connection_resolved",
      title: "Solicitud aceptada",
      body: "Tu profesional ha aceptado tu solicitud de conexión.",
      url: "/perfil",
    }),
  );

  revalidatePath("/pacientes");

  return { success: true };
}

export async function rejectConnectionRequest(
  requestId: string,
): Promise<ActionResult> {
  const profile = await requireRole("psychologist");

  const [request] = await db
    .update(connectionRequests)
    .set({ status: "rejected", resolvedAt: new Date() })
    .where(
      and(
        eq(connectionRequests.id, requestId),
        eq(connectionRequests.psychologistId, profile.id),
        eq(connectionRequests.status, "pending"),
      ),
    )
    .returning({ patientId: connectionRequests.patientId });

  if (!request) {
    return { error: "La solicitud ya no está disponible" };
  }

  await logAuditEvent({
    actorId: profile.id,
    action: "connection.rejected",
    entityType: "connection_request",
    entityId: requestId,
  });

  after(() =>
    sendPushToUser(request.patientId, {
      topic: "connection_resolved",
      title: "Solicitud rechazada",
      body: "Tu profesional ha rechazado tu solicitud de conexión.",
      url: "/perfil",
    }),
  );

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
