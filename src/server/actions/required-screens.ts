"use server";

import { db } from "@/db";
import { screenAcknowledgements } from "@/db/schema";
import { REQUIRED_SCREENS } from "@/lib/required-screens";
import { requireProfile } from "@/server/auth/get-current-profile";
import { requiredScreenSchema } from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function acknowledgeScreen(input: unknown): Promise<ActionResult> {
  const profile = await requireProfile();

  const parsed = requiredScreenSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Pantalla no válida" };
  }

  const screen = REQUIRED_SCREENS[parsed.data];

  if (!profile.role || !screen.roles.includes(profile.role)) {
    return { error: "Pantalla no válida" };
  }

  await db
    .insert(screenAcknowledgements)
    .values({
      profileId: profile.id,
      screen: screen.id,
      version: screen.version,
    })
    .onConflictDoNothing();

  return { success: true };
}
