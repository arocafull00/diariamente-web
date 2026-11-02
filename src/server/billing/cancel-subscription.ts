import { eq } from "drizzle-orm";

import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { hasActiveSubscription } from "@/lib/billing";

import { getStripe } from "./stripe";

async function getActiveSubscriptionId(profileId: string) {
  const [subscription] = await db
    .select({
      id: subscriptions.stripeSubscriptionId,
      status: subscriptions.status,
    })
    .from(subscriptions)
    .where(eq(subscriptions.profileId, profileId))
    .limit(1);

  if (!subscription || !hasActiveSubscription(subscription.status)) {
    return null;
  }

  return subscription.id;
}

export async function cancelSubscriptionAtPeriodEnd(profileId: string) {
  const subscriptionId = await getActiveSubscriptionId(profileId);

  if (!subscriptionId) {
    return false;
  }

  await getStripe().subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return true;
}

export async function cancelSubscriptionNow(profileId: string) {
  const subscriptionId = await getActiveSubscriptionId(profileId);

  if (!subscriptionId) {
    return;
  }

  await getStripe().subscriptions.cancel(subscriptionId);
}
