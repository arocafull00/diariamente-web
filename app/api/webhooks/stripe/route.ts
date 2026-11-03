import type Stripe from "stripe";
import { headers } from "next/headers";

import { logger } from "@/lib/logger";
import { logAuditEvent } from "@/server/audit";
import { getStripe } from "@/server/billing/stripe";
import { syncSubscription } from "@/server/billing/sync-subscription";
import { rewardReferrer } from "@/server/referrals/reward-referrer";

const SUBSCRIPTION_EVENTS = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

async function handleSubscription(subscription: Stripe.Subscription) {
  const profileId = await syncSubscription(subscription);

  if (!profileId) {
    logger.warn("webhooks.stripe.unknown_customer", {
      subscriptionId: subscription.id,
    });
    return;
  }

  await logAuditEvent({
    actorId: profileId,
    action: `billing.subscription_${subscription.status}`,
    entityType: "subscription",
    entityId: subscription.id,
  });

  if (subscription.status === "active") {
    await rewardReferrer(profileId);
  }
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error(
      "webhooks.stripe.missing_secret",
      new Error("STRIPE_WEBHOOK_SECRET is not configured"),
    );
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const signature = headerPayload.get("stripe-signature");

  if (!signature) {
    logger.warn("webhooks.stripe.missing_signature");
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const payload = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    logger.warn("webhooks.stripe.invalid_signature", {
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const subscriptionId = event.data.object.subscription;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(
          typeof subscriptionId === "string" ? subscriptionId : subscriptionId.id,
        );
        await handleSubscription(subscription);
      }
    }

    if (SUBSCRIPTION_EVENTS.has(event.type)) {
      const subscription = await stripe.subscriptions.retrieve(
        (event.data.object as Stripe.Subscription).id,
      );
      await handleSubscription(subscription);
    }
  } catch (error) {
    logger.error("webhooks.stripe.handler_failed", error, {
      eventType: event.type,
      eventId: event.id,
    });
    return new Response("Webhook handler failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
