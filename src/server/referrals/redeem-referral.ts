import { db } from "@/db";
import { referrals } from "@/db/schema";
import { logAuditEvent } from "@/server/audit";
import { getBillingState } from "@/server/billing/get-billing-state";
import { getReferralCodeOwner } from "@/server/queries";

import type { ActionResult } from "@/server/actions/onboarding";

export async function redeemReferral(
  profileId: string,
  code: string,
): Promise<ActionResult> {
  const [referrer, billing] = await Promise.all([
    getReferralCodeOwner(code),
    getBillingState(profileId),
  ]);

  if (!referrer) {
    return { error: "Ese código no nos suena. ¿Lo revisas?" };
  }

  if (referrer.id === profileId) {
    return { error: "¡Buen intento! Pero tu propio código no vale" };
  }

  if (billing?.access !== "trial_available") {
    return { error: "El código solo vale antes de empezar tu prueba" };
  }

  const [referral] = await db
    .insert(referrals)
    .values({ referrerId: referrer.id, referredId: profileId })
    .onConflictDoNothing()
    .returning({ id: referrals.id });

  if (!referral) {
    return { error: "Ya has usado un código de invitación" };
  }

  await logAuditEvent({
    actorId: profileId,
    action: "referral.redeemed",
    entityType: "referral",
    entityId: referral.id,
  });

  return { success: true };
}
