import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { TRIAL_DAYS } from "@/lib/billing";
import { REFERRAL_BONUS_DAYS } from "@/lib/referrals";
import { getBillingSnapshot } from "@/server/queries";

import { getStripe } from "./stripe";

const SECONDS_PER_DAY = 24 * 60 * 60;
const EXTENDABLE_STATUSES = ["active", "trialing"];

export async function grantFreeMonth(profileId: string) {
  const snapshot = await getBillingSnapshot(profileId);

  if (!snapshot) {
    return;
  }

  const { subscriptionId, subscriptionStatus, trialEndsAt } = snapshot.account;

  if (subscriptionId && subscriptionStatus && EXTENDABLE_STATUSES.includes(subscriptionStatus)) {
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const [item] = subscription.items.data;
    const freeFrom = Math.max(
      subscription.trial_end ?? 0,
      item?.current_period_end ?? 0,
      Math.floor(Date.now() / 1000),
    );

    await stripe.subscriptions.update(subscriptionId, {
      trial_end: freeFrom + REFERRAL_BONUS_DAYS * SECONDS_PER_DAY,
      proration_behavior: "none",
    });
    return;
  }

  const bonusDays =
    !trialEndsAt && !subscriptionStatus
      ? TRIAL_DAYS + REFERRAL_BONUS_DAYS
      : REFERRAL_BONUS_DAYS;

  await db
    .update(profiles)
    .set({
      trialEndsAt: sql`greatest(${profiles.trialEndsAt}, now()) + make_interval(days => ${bonusDays}::int)`,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, profileId));
}
