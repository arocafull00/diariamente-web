import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { referrals } from "@/db/schema";
import { logAuditEvent } from "@/server/audit";
import { grantFreeMonth } from "@/server/billing/grant-free-month";

export async function rewardReferrer(referredId: string) {
  const [referral] = await db
    .update(referrals)
    .set({ rewardedAt: new Date() })
    .where(and(eq(referrals.referredId, referredId), isNull(referrals.rewardedAt)))
    .returning({ id: referrals.id, referrerId: referrals.referrerId });

  if (!referral) {
    return;
  }

  try {
    await grantFreeMonth(referral.referrerId);
  } catch (error) {
    await db
      .update(referrals)
      .set({ rewardedAt: null })
      .where(eq(referrals.id, referral.id));
    throw error;
  }

  await logAuditEvent({
    actorId: referral.referrerId,
    action: "referral.rewarded",
    entityType: "referral",
    entityId: referral.id,
  });
}
