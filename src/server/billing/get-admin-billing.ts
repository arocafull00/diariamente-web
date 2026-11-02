import { getClinicPsychologistCount } from "@/server/queries";

import { getBillingState } from "./get-billing-state";

export async function getAdminBilling(profileId: string) {
  const billing = await getBillingState(profileId);

  if (!billing) {
    return null;
  }

  const { account, ownClinic, access } = billing;
  const psychologistCount = ownClinic
    ? await getClinicPsychologistCount(ownClinic.id)
    : 0;

  return {
    id: account.id,
    role: account.role,
    access,
    lifetimeAccess: account.lifetimeAccess,
    trialEndsAt: account.trialEndsAt,
    subscriptionStatus: account.subscriptionStatus,
    clinic: ownClinic
      ? {
          id: ownClinic.id,
          name: ownClinic.name,
          monthlyPriceCents: ownClinic.monthlyPriceCents,
          psychologistCount,
        }
      : null,
  };
}
