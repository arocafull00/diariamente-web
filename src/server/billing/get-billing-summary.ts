import { PSYCHOLOGIST_MONTHLY_PRICE_CENTS } from "@/lib/billing";

import { getBillingState } from "./get-billing-state";
import { getClinicDefaultPriceCents } from "./get-clinic-default-price";

export async function getBillingSummary(profileId: string) {
  const billing = await getBillingState(profileId);

  if (!billing) {
    throw new Error("Billing state not found");
  }

  const { access, account, ownClinic, memberClinic } = billing;

  return {
    access,
    role: account.role,
    trialEndsAt: account.trialEndsAt,
    subscriptionStatus: account.subscriptionStatus,
    currentPeriodEnd: account.currentPeriodEnd,
    cancelAtPeriodEnd: account.cancelAtPeriodEnd ?? false,
    monthlyPriceCents:
      account.role === "clinic"
        ? (ownClinic?.monthlyPriceCents ?? (await getClinicDefaultPriceCents()))
        : PSYCHOLOGIST_MONTHLY_PRICE_CENTS,
    clinicName: memberClinic?.name ?? null,
    hasCustomer: account.stripeCustomerId !== null,
  };
}
