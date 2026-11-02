import { Mail } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

import { BillingRedirectButton } from "./billing-redirect-button";
import { getBillingStatusCopy, type BillingSummary } from "./billing-status-copy";
import { TrialPlanSummary } from "./trial-plan-summary";

const CONTACT_EMAIL = "adrianrocafull1@gmail.com";

type SubscriptionPaywallProps = {
  billing: BillingSummary;
};

export function SubscriptionPaywall({ billing }: SubscriptionPaywallProps) {
  const { icon: Icon, title, description, canSubscribe, canManage } =
    getBillingStatusCopy(billing);
  const needsContact = billing.role === "clinic" && !canSubscribe;
  const isTrialAvailable = billing.access === "trial_available";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-primary">
        <Icon className="size-8" aria-hidden="true" />
      </span>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {isTrialAvailable && billing.role && billing.monthlyPriceCents !== null ? (
        <TrialPlanSummary
          role={billing.role}
          monthlyPriceCents={billing.monthlyPriceCents}
        />
      ) : null}
      <div className="flex w-full flex-col gap-2">
        {canSubscribe ? (
          <BillingRedirectButton action={isTrialAvailable ? "trial" : "checkout"} />
        ) : null}
        {needsContact ? (
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Precio%20para%20mi%20cl%C3%ADnica`}
            className={buttonVariants({ variant: "default" })}
          >
            <Mail aria-hidden="true" />
            Contactar
          </a>
        ) : null}
        {canManage ? <BillingRedirectButton action="portal" /> : null}
      </div>
      {billing.role === "psychologist" && billing.access === "expired" ? (
        <p className="text-xs text-muted-foreground">
          Tus pacientes pueden seguir usando DiariaMente y no se pierde ningún
          registro.
        </p>
      ) : null}
    </main>
  );
}
