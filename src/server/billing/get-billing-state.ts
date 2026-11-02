import { resolveBillingAccess } from "@/lib/billing";
import { getBillingSnapshot } from "@/server/queries";

export async function getBillingState(profileId: string) {
  const snapshot = await getBillingSnapshot(profileId);

  if (!snapshot) {
    return null;
  }

  const { account, ownClinic, memberClinic } = snapshot;

  const access = resolveBillingAccess(
    {
      role: account.role,
      lifetimeAccess: account.lifetimeAccess,
      trialEndsAt: account.trialEndsAt,
      subscriptionStatus: account.subscriptionStatus,
      clinicPriceId: ownClinic?.stripePriceId ?? null,
    },
    memberClinic && {
      role: memberClinic.ownerRole,
      lifetimeAccess: memberClinic.ownerLifetimeAccess,
      trialEndsAt: memberClinic.ownerTrialEndsAt,
      subscriptionStatus: memberClinic.ownerSubscriptionStatus,
      clinicPriceId: memberClinic.stripePriceId,
    },
    new Date(),
  );

  return { ...snapshot, access };
}
