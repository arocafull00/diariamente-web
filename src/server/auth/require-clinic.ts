import { notFound, redirect } from "next/navigation";

import { getClinicByOwner, getClinicPsychologistStats } from "@/server/queries";

import { requireRole } from "./get-current-profile";

export async function requireClinic() {
  const profile = await requireRole("clinic");
  const clinic = await getClinicByOwner(profile.id);

  if (!clinic) {
    redirect("/onboarding");
  }

  return { profile, clinic };
}

export async function requireClinicPsychologist(psychologistId: string) {
  const { profile, clinic } = await requireClinic();
  const [psychologist] = await getClinicPsychologistStats(
    clinic.id,
    psychologistId,
  );

  if (!psychologist) {
    notFound();
  }

  return { profile, clinic, psychologist };
}
