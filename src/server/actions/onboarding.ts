"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinics, profiles, screenAcknowledgements } from "@/db/schema";
import { logger } from "@/lib/logger";
import { REFERRAL_COOKIE_NAME } from "@/lib/referrals";
import { REQUIRED_SCREENS } from "@/lib/required-screens";
import { logAuditEvent } from "@/server/audit";
import {
  getCurrentProfile,
  requireUser,
} from "@/server/auth/get-current-profile";
import { deleteProfileAndIdentity } from "@/server/profiles/delete-profile";
import { redeemReferral } from "@/server/referrals/redeem-referral";
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
  const existingProfile = await getCurrentProfile();

  if (existingProfile?.onboardingCompleted) {
    redirect("/");
  }

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
    return { error: parsed.error.issues[0]?.message ?? "Algo no cuadra en los datos. Revísalos" };
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

    const acceptedNow =
      !clerkUser.legalAcceptedAt && formData.get("legalAccepted") === "true";

    if (acceptedNow) {
      await client.users.updateUser(userId, { legalAcceptedAt: new Date() });
      await logAuditEvent({
        actorId: userId,
        action: "legal.terms_accepted",
        entityType: "profile",
        entityId: userId,
        metadata: { version: REQUIRED_SCREENS.terms.version },
      });
    }

    if (clerkUser.legalAcceptedAt || acceptedNow) {
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
    return { error: "Uy, no hemos podido crear tu cuenta. Inténtalo de nuevo." };
  }

  logger.info("auth.signup.completed", { userId, role });

  const cookieStore = await cookies();
  const referralCode = cookieStore.get(REFERRAL_COOKIE_NAME)?.value;

  if (role === "psychologist" && referralCode) {
    const referral = await redeemReferral(userId, referralCode).catch(
      (error: unknown) => {
        logger.error("referrals.redeem_on_signup_failed", error, { userId });
        return { success: false };
      },
    );

    if (referral.success) {
      cookieStore.delete(REFERRAL_COOKIE_NAME);
    }
  }

  redirect(role === "patient" ? "/bienvenida" : "/suscripcion");
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

  return { success: true };
}
