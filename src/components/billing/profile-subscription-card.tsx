import { Illustration } from "@/components/faces/illustration";
import { ProfileSectionCard } from "@/components/profile/profile-section-card";

import { BillingPortalRow } from "./billing-portal-row";
import { BillingRedirectButton } from "./billing-redirect-button";
import { getBillingStatusCopy, type BillingSummary } from "./billing-status-copy";
import { BillingSuccessToast } from "./billing-success-toast";

type ProfileSubscriptionCardProps = {
  billing: BillingSummary;
};

export function ProfileSubscriptionCard({ billing }: ProfileSubscriptionCardProps) {
  const { icon: Icon, title, description, canSubscribe, canManage } =
    getBillingStatusCopy(billing);

  if (canManage && !canSubscribe) {
    return (
      <ProfileSectionCard title="Suscripción" flush>
        <BillingSuccessToast />
        <BillingPortalRow icon={Icon} title={title} description={description} />
      </ProfileSectionCard>
    );
  }

  return (
    <ProfileSectionCard title="Suscripción">
      <BillingSuccessToast />
      <div className="flex items-start gap-3">
        {typeof Icon === "string" ? (
          <Illustration name={Icon} />
        ) : (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
            <Icon className="size-6" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {canSubscribe ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <BillingRedirectButton
            action={billing.access === "trial_available" ? "trial" : "checkout"}
          />
        </div>
      ) : null}
    </ProfileSectionCard>
  );
}
