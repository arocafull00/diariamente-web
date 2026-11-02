import { redirect } from "next/navigation";

import { isBillingBlocked } from "@/lib/billing";
import { getBillingState } from "@/server/billing/get-billing-state";

export async function requireBillingAccess(profileId: string) {
  const billing = await getBillingState(profileId);

  if (billing && isBillingBlocked(billing.access)) {
    redirect("/suscripcion");
  }
}
