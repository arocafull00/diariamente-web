import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { profiles, psychologistPatient } from "@/db/schema";

import { requireProfile } from "./get-current-profile";

export async function requirePatientRelationship(patientId: string) {
  const profile = await requireProfile();

  if (profile.role === "patient") {
    if (profile.id !== patientId) {
      notFound();
    }

    return profile;
  }

  const [relationship] = await db
    .select({
      patientId: psychologistPatient.patientId,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(psychologistPatient)
    .innerJoin(profiles, eq(profiles.id, psychologistPatient.patientId))
    .where(
      and(
        eq(psychologistPatient.patientId, patientId),
        eq(psychologistPatient.psychologistId, profile.id),
      ),
    )
    .limit(1);

  if (!relationship) {
    notFound();
  }

  return { profile, patient: relationship };
}
