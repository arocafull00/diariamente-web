"use server";

import { clerkClient } from "@clerk/nextjs/server";

import { db } from "@/db";
import { screenAcknowledgements } from "@/db/schema";
import { logger } from "@/lib/logger";
import { REQUIRED_SCREENS } from "@/lib/required-screens";
import { logAuditEvent } from "@/server/audit";
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

  if (screen.id === "terms") {
    try {
      const client = await clerkClient();
      await client.users.updateUser(profile.id, { legalAcceptedAt: new Date() });
    } catch (error) {
      logger.error("legal.terms_accept_failed", error, { userId: profile.id });
      return { error: "No se pudo guardar la aceptación. Inténtalo de nuevo." };
    }
  }

  await db
    .insert(screenAcknowledgements)
    .values({
      profileId: profile.id,
      screen: screen.id,
      version: screen.version,
    })
    .onConflictDoNothing();

  if (screen.id === "terms") {
    await logAuditEvent({
      actorId: profile.id,
      action: "legal.terms_accepted",
      entityType: "profile",
      entityId: profile.id,
      metadata: { version: screen.version },
    });
  }

  return { success: true };
}
