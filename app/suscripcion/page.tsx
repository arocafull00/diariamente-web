import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getBillingStatusCopy } from "@/components/billing/billing-status-copy";
import { SubscriptionPaywall } from "@/components/billing/subscription-paywall";
import { SubscriptionTrialOffer } from "@/components/billing/subscription-trial-offer";
import { logger } from "@/lib/logger";
import { REFERRAL_COOKIE_NAME } from "@/lib/referrals";
import { startCheckout } from "@/server/actions/billing";
import { requireProfile } from "@/server/auth/get-current-profile";
import { confirmCheckoutSession } from "@/server/billing/confirm-checkout-session";
import { getBillingSummary } from "@/server/billing/get-billing-summary";
import { getReferrer } from "@/server/queries";

export const metadata: Metadata = {
  title: "Suscripción",
};

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; inicio?: string }>;
}) {
  const [profile, { session_id: sessionId, inicio }] = await Promise.all([
    requireProfile(),
    searchParams,
  ]);

  if (profile.role !== "psychologist" && profile.role !== "clinic") {
    redirect("/");
  }

  if (sessionId?.startsWith("cs_")) {
    await confirmCheckoutSession(sessionId, profile.id).catch((error: unknown) => {
      logger.error("billing.checkout_confirm_failed", error, {
        profileId: profile.id,
      });
    });
    if (!inicio) {
      redirect("/perfil?suscripcion=ok");
    }

    redirect(profile.role === "psychologist" ? "/bienvenida" : "/");
  }

  const [billing, referrer, cookieStore] = await Promise.all([
    getBillingSummary(profile.id),
    getReferrer(profile.id),
    cookies(),
  ]);
  const { canSubscribe } = getBillingStatusCopy(billing);

  if (
    canSubscribe &&
    billing.access === "trial_available" &&
    billing.monthlyPriceCents !== null
  ) {
    const referrerName = referrer
      ? [referrer.firstName, referrer.lastName].filter(Boolean).join(" ") || "Otro psicólogo"
      : null;

    return (
      <div className="flex min-h-svh flex-col bg-background">
        <SubscriptionTrialOffer
          role={profile.role}
          monthlyPriceCents={billing.monthlyPriceCents}
          referrerName={referrerName}
          showReferralForm={profile.role === "psychologist" && !referrer}
          pendingReferralCode={cookieStore.get(REFERRAL_COOKIE_NAME)?.value}
        />
      </div>
    );
  }

  if (canSubscribe) {
    const checkout = await startCheckout();

    if (checkout.url) {
      redirect(checkout.url);
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SubscriptionPaywall billing={billing} />
    </div>
  );
}
