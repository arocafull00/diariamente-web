"use server";

import { addHours } from "date-fns";
import { headers } from "next/headers";

import { TRIAL_DAYS } from "@/lib/billing";
import { logger } from "@/lib/logger";
import { logAuditEvent } from "@/server/audit";
import { requireProfile } from "@/server/auth/get-current-profile";
import { ensureStripeCustomer } from "@/server/billing/ensure-stripe-customer";
import { getBillingState } from "@/server/billing/get-billing-state";
import { getStripe } from "@/server/billing/stripe";

import type { ActionResult } from "./onboarding";

type RedirectResult = ActionResult & { url?: string };

const CHECKOUT_MIN_TRIAL_HOURS = 49;
const PAID_ACCESS = ["lifetime", "clinic", "subscribed"];

async function getOrigin() {
  const headerList = await headers();

  return headerList.get("origin") ?? "https://diariamente.es";
}

export async function startCheckout(): Promise<RedirectResult> {
  const profile = await requireProfile();

  if (profile.role !== "psychologist" && profile.role !== "clinic") {
    return { error: "Tu cuenta no necesita suscripción" };
  }

  const billing = await getBillingState(profile.id);

  if (!billing || PAID_ACCESS.includes(billing.access)) {
    return { error: "Ya tienes acceso a DiariaMente" };
  }

  const priceId =
    profile.role === "clinic"
      ? (billing.ownClinic?.stripePriceId ??
        process.env.STRIPE_CLINIC_DEFAULT_PRICE_ID)
      : process.env.STRIPE_PSYCHOLOGIST_PRICE_ID;

  if (!priceId) {
    return { error: "Aún estamos preparando tu precio personalizado" };
  }

  try {
    const customerId = await ensureStripeCustomer(profile);
    const origin = await getOrigin();
    const minTrialEnd = addHours(new Date(), CHECKOUT_MIN_TRIAL_HOURS);
    const trialEndsAt = billing.account.trialEndsAt;
    const trialEnd =
      billing.access === "trial" && trialEndsAt
        ? Math.floor(
            Math.max(trialEndsAt.getTime(), minTrialEnd.getTime()) / 1000,
          )
        : undefined;
    const trialPeriodDays =
      billing.access === "trial_available" ? TRIAL_DAYS : undefined;
    const hasTrial = trialEnd !== undefined || trialPeriodDays !== undefined;

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: profile.id,
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_collection: "if_required",
      subscription_data: {
        metadata: { profileId: profile.id },
        trial_end: trialEnd,
        trial_period_days: trialPeriodDays,
        trial_settings: hasTrial
          ? { end_behavior: { missing_payment_method: "cancel" } }
          : undefined,
      },
      locale: "es",
      success_url: `${origin}/suscripcion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/perfil`,
    });

    if (!session.url) {
      return { error: "No se pudo iniciar el pago" };
    }

    await logAuditEvent({
      actorId: profile.id,
      action: "billing.checkout_started",
      entityType: "profile",
      entityId: profile.id,
    });

    return { url: session.url };
  } catch (error) {
    logger.error("billing.checkout_failed", error, { profileId: profile.id });
    return { error: "No se pudo iniciar el pago. Inténtalo de nuevo." };
  }
}

export async function openBillingPortal(): Promise<RedirectResult> {
  const profile = await requireProfile();

  if (!profile.stripeCustomerId) {
    return { error: "No tienes ninguna suscripción" };
  }

  try {
    const origin = await getOrigin();
    const session = await getStripe().billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${origin}/perfil`,
      locale: "es",
    });

    return { url: session.url };
  } catch (error) {
    logger.error("billing.portal_failed", error, { profileId: profile.id });
    return { error: "No se pudo abrir la gestión de la suscripción" };
  }
}
