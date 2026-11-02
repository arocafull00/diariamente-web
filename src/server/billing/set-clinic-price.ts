import { eq } from "drizzle-orm";

import { db } from "@/db";
import { clinics, subscriptions } from "@/db/schema";
import { CLINIC_PRICE_GRACE_DAYS, hasActiveSubscription } from "@/lib/billing";

import { extendTrial } from "./extend-trial";
import { getStripe } from "./stripe";

export async function setClinicPrice(clinicId: string, monthlyPriceCents: number) {
  const productId = process.env.STRIPE_CLINIC_PRODUCT_ID;

  if (!productId) {
    throw new Error("STRIPE_CLINIC_PRODUCT_ID is not configured");
  }

  const [clinic] = await db
    .select({
      ownerId: clinics.ownerId,
      stripePriceId: clinics.stripePriceId,
      subscriptionId: subscriptions.stripeSubscriptionId,
      subscriptionStatus: subscriptions.status,
    })
    .from(clinics)
    .leftJoin(subscriptions, eq(subscriptions.profileId, clinics.ownerId))
    .where(eq(clinics.id, clinicId))
    .limit(1);

  if (!clinic) {
    throw new Error("Clinic not found");
  }

  const stripe = getStripe();
  const price = await stripe.prices.create({
    product: productId,
    currency: "eur",
    unit_amount: monthlyPriceCents,
    recurring: { interval: "month" },
    tax_behavior: "inclusive",
    metadata: { clinicId },
  });

  if (clinic.subscriptionId && hasActiveSubscription(clinic.subscriptionStatus)) {
    const subscription = await stripe.subscriptions.retrieve(clinic.subscriptionId);

    await stripe.subscriptions.update(clinic.subscriptionId, {
      items: [{ id: subscription.items.data[0].id, price: price.id }],
      proration_behavior: "none",
    });
  }

  if (clinic.stripePriceId) {
    await stripe.prices.update(clinic.stripePriceId, { active: false });
  }

  await db
    .update(clinics)
    .set({ stripePriceId: price.id, monthlyPriceCents, updatedAt: new Date() })
    .where(eq(clinics.id, clinicId));

  if (!clinic.stripePriceId) {
    await extendTrial(clinic.ownerId, CLINIC_PRICE_GRACE_DAYS);
  }
}
