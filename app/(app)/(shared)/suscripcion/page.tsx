import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-shell/app-header";
import { getBillingStatusCopy } from "@/components/billing/billing-status-copy";
import { SubscriptionPaywall } from "@/components/billing/subscription-paywall";
import { logger } from "@/lib/logger";
import { startCheckout } from "@/server/actions/billing";
import { requireProfile } from "@/server/auth/get-current-profile";
import { confirmCheckoutSession } from "@/server/billing/confirm-checkout-session";
import { getBillingSummary } from "@/server/billing/get-billing-summary";

export const metadata: Metadata = {
  title: "Suscripción",
};

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const [profile, { session_id: sessionId }] = await Promise.all([
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
    redirect("/perfil?suscripcion=ok");
  }

  const billing = await getBillingSummary(profile.id);

  if (getBillingStatusCopy(billing).canSubscribe) {
    const checkout = await startCheckout();

    if (checkout.url) {
      redirect(checkout.url);
    }
  }

  return (
    <>
      <AppHeader title="Suscripción" />
      <SubscriptionPaywall billing={billing} />
    </>
  );
}
