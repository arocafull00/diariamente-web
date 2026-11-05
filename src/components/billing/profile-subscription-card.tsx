import { Illustration } from "@/components/faces/illustration";
import { ProfileSectionCard } from "@/components/profile/profile-section-card";

import { BillingPortalRow } from "./billing-portal-row";
import { BillingRedirectButton } from "./billing-redirect-button";
import { getBillingStatusCopy, type BillingSummary } from "./billing-status-copy";

type ProfileSubscriptionCardProps = {
  billing: BillingSummary;
};

export function ProfileSubscriptionCard({ billing }: ProfileSubscriptionCardProps) {
  const { icon: Icon, title, description, canSubscribe, canManage } =
    getBillingStatusCopy(billing);

  if (canManage && !canSubscribe) {
    return (
      <ProfileSectionCard title="Estado de la suscripción" flush>
        <BillingPortalRow icon={Icon} title={title} description={description} />
      </ProfileSectionCard>
    );
  }

  return (
    <ProfileSectionCard title="Estado de la suscripción">
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
        <BillingRedirectButton
          action={billing.access === "trial_available" ? "trial" : "checkout"}
          className="mt-4 w-full"
        />
      ) : null}
    </ProfileSectionCard>
  );
}
