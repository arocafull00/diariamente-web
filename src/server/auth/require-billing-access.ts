import { redirect } from "next/navigation";

import { getBillingState } from "@/server/billing/get-billing-state";

export async function requireBillingAccess(profileId: string) {
  const billing = await getBillingState(profileId);

  if (billing?.access === "expired") {
    redirect("/suscripcion");
  }
}
