import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-shell/app-header";
import { SubscriptionPaywall } from "@/components/billing/subscription-paywall";
import { requireProfile } from "@/server/auth/get-current-profile";
import { getBillingSummary } from "@/server/billing/get-billing-summary";

export const metadata: Metadata = {
  title: "Suscripción",
};

export default async function SubscriptionPage() {
  const profile = await requireProfile();

  if (profile.role !== "psychologist" && profile.role !== "clinic") {
    redirect("/");
  }

  const billing = await getBillingSummary(profile.id);

  return (
    <>
      <AppHeader title="Suscripción" />
      <SubscriptionPaywall billing={billing} />
    </>
  );
}
