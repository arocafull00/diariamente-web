import type Stripe from "stripe";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles, subscriptions } from "@/db/schema";
import { hasActiveSubscription } from "@/lib/billing";

async function resolveProfileId(subscription: Stripe.Subscription) {
  if (subscription.metadata.profileId) {
    return subscription.metadata.profileId;
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const [profile] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.stripeCustomerId, customerId))
    .limit(1);

  return profile?.id ?? null;
}

export async function syncSubscription(subscription: Stripe.Subscription) {
  const profileId = await resolveProfileId(subscription);

  if (!profileId) {
    return null;
  }

  const [item] = subscription.items.data;
  const values = {
    stripeSubscriptionId: subscription.id,
    stripePriceId: item?.price.id ?? "",
    status: subscription.status,
    currentPeriodEnd: item ? new Date(item.current_period_end * 1000) : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: new Date(),
  };

  await db
    .insert(subscriptions)
    .values({ profileId, ...values })
    .onConflictDoUpdate({
      target: subscriptions.profileId,
      set: values,
      setWhere: hasActiveSubscription(subscription.status)
        ? undefined
        : eq(subscriptions.stripeSubscriptionId, subscription.id),
    });

  return profileId;
}
