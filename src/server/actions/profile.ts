"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { requireProfile } from "@/server/auth/get-current-profile";
import { updateProfileSchema } from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function updateProfile(input: unknown): Promise<ActionResult> {
  const profile = await requireProfile();

  const parsed = updateProfileSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { firstName, lastName, avatarUrl } = parsed.data;

  await db
    .update(profiles)
    .set({
      firstName,
      lastName,
      avatarUrl,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, profile.id));

  const client = await clerkClient();
  await client.users.updateUser(profile.id, {
    firstName,
    lastName,
  });

  revalidatePath("/perfil");
  revalidatePath("/ajustes");
  revalidatePath("/inicio");
  revalidatePath("/pacientes", "layout");

  return { success: true };
}
