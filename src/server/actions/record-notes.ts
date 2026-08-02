"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { recordNotes } from "@/db/schema";
import { logAuditEvent } from "@/server/audit";
import { requireRecordAccess } from "@/server/auth/require-record-access";
import { getRecordNote } from "@/server/queries";
import { recordNoteSchema } from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function upsertRecordNote(
  recordId: string,
  input: unknown,
): Promise<ActionResult> {
  const { profile, record } = await requireRecordAccess(recordId);

  if (profile.role !== "psychologist") {
    return { error: "No autorizado" };
  }

  const parsed = recordNoteSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existingNote = await getRecordNote(recordId);

  const [note] = await db
    .insert(recordNotes)
    .values({
      recordId: record.id,
      psychologistId: profile.id,
      content: parsed.data.content,
    })
    .onConflictDoUpdate({
      target: recordNotes.recordId,
      set: {
        content: parsed.data.content,
        updatedAt: new Date(),
      },
    })
    .returning({ id: recordNotes.id });

  await logAuditEvent({
    actorId: profile.id,
    action: existingNote ? "record_note.updated" : "record_note.created",
    entityType: "record_note",
    entityId: note.id,
  });

  revalidatePath(`/registro/${recordId}`);
  revalidatePath(`/pacientes/${record.patientId}`);

  return { success: true };
}

export async function deleteRecordNote(recordId: string): Promise<ActionResult> {
  const { profile, record } = await requireRecordAccess(recordId);

  if (profile.role !== "psychologist") {
    return { error: "No autorizado" };
  }

  const [deleted] = await db
    .delete(recordNotes)
    .where(
      and(
        eq(recordNotes.recordId, record.id),
        eq(recordNotes.psychologistId, profile.id),
      ),
    )
    .returning({ id: recordNotes.id });

  if (!deleted) {
    return { error: "La nota no existe" };
  }

  await logAuditEvent({
    actorId: profile.id,
    action: "record_note.deleted",
    entityType: "record_note",
    entityId: deleted.id,
  });

  revalidatePath(`/registro/${recordId}`);
  revalidatePath(`/pacientes/${record.patientId}`);

  return { success: true };
}
