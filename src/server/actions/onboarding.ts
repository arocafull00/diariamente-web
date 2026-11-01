"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinics, profiles, screenAcknowledgements } from "@/db/schema";
import { logger } from "@/lib/logger";
import { REQUIRED_SCREENS } from "@/lib/required-screens";
import { logAuditEvent } from "@/server/audit";
import { requireUser } from "@/server/auth/get-current-profile";
import { deleteProfileAndIdentity } from "@/server/profiles/delete-profile";
import { onboardingSchema } from "@/validation/schemas";

export type ActionResult = {
  error?: string;
  success?: boolean;
};

export async function completeOnboarding(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await requireUser();

  const rawAvatarUrl = formData.get("avatarUrl");

  const parsed = onboardingSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    role: formData.get("role"),
    clinicName: formData.get("clinicName") ?? "",
    grammaticalGender: formData.get("grammaticalGender"),
    avatarUrl:
      typeof rawAvatarUrl === "string" && rawAvatarUrl.length > 0
        ? rawAvatarUrl
        : null,
  });

  if (!parsed.success) {
    logger.warn("auth.signup.onboarding_invalid", {
      userId,
      field: parsed.error.issues[0]?.path.join(".") ?? null,
    });
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { firstName, lastName, role, clinicName, grammaticalGender, avatarUrl } =
    parsed.data;

  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const resolvedAvatarUrl = avatarUrl ?? clerkUser.imageUrl ?? null;

    await db
      .insert(profiles)
      .values({
        id: userId,
        firstName,
        lastName,
        role,
        grammaticalGender,
        avatarUrl: resolvedAvatarUrl,
        onboardingCompleted: true,
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          firstName,
          lastName,
          role,
          grammaticalGender,
          avatarUrl: resolvedAvatarUrl,
          onboardingCompleted: true,
          updatedAt: new Date(),
        },
      });

    if (role === "clinic") {
      const [clinic] = await db
        .insert(clinics)
        .values({ ownerId: userId, name: clinicName })
        .onConflictDoUpdate({
          target: clinics.ownerId,
          set: { name: clinicName, updatedAt: new Date() },
        })
        .returning({ id: clinics.id });

      await logAuditEvent({
        actorId: userId,
        action: "clinic.created",
        entityType: "clinic",
        entityId: clinic.id,
      });
    }

    if (clerkUser.legalAcceptedAt) {
      await db
        .insert(screenAcknowledgements)
        .values({
          profileId: userId,
          screen: REQUIRED_SCREENS.terms.id,
          version: REQUIRED_SCREENS.terms.version,
        })
        .onConflictDoNothing();
    }

    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });
  } catch (error) {
    logger.error("auth.signup.onboarding_failed", error, { userId, role });
    return { error: "No se pudo completar el registro. Inténtalo de nuevo." };
  }

  logger.info("auth.signup.completed", { userId, role });

  redirect(role === "clinic" ? "/" : "/bienvenida");
}

export async function deleteAccount(): Promise<ActionResult> {
  const userId = await requireUser();

  await logAuditEvent({
    actorId: userId,
    action: "account.deleted",
    entityType: "profile",
    entityId: userId,
  });

  await deleteProfileAndIdentity(userId);

  revalidatePath("/");
  redirect("/login");
}
