"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { REFERRAL_COOKIE_NAME } from "@/lib/referrals";
import { requireRoleProfile } from "@/server/auth/get-current-profile";
import { redeemReferral } from "@/server/referrals/redeem-referral";
import { referralCodeSchema } from "@/validation/schemas";

import type { ActionResult } from "./onboarding";

export async function redeemReferralCode(input: unknown): Promise<ActionResult> {
  const profile = await requireRoleProfile("psychologist");

  const parsed = referralCodeSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ese código no nos suena" };
  }

  const result = await redeemReferral(profile.id, parsed.data);

  if (result.error) {
    return result;
  }

  const cookieStore = await cookies();
  cookieStore.delete(REFERRAL_COOKIE_NAME);

  revalidatePath("/suscripcion");

  return { success: true };
}
