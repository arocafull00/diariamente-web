"use client";

import { CreditCard, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { openBillingPortal, startCheckout } from "@/server/actions/billing";

import { useBillingRedirect } from "./use-billing-redirect";

const BILLING_ACTIONS = {
  checkout: { run: startCheckout, label: "Suscribirme" },
  trial: { run: startCheckout, label: "Empezar prueba gratuita" },
  portal: { run: openBillingPortal, label: "Gestionar suscripción" },
};

type BillingRedirectButtonProps = {
  action: keyof typeof BILLING_ACTIONS;
  className?: string;
};

export function BillingRedirectButton({
  action,
  className,
}: BillingRedirectButtonProps) {
  const { run, label } = BILLING_ACTIONS[action];
  const { pending, redirect } = useBillingRedirect(run);

  return (
    <Button
      variant={action === "portal" ? "outline" : "default"}
      className={cn(
        action === "trial" && "btn-raised-joy text-mood-foreground",
        className,
      )}
      disabled={pending}
      onClick={redirect}
    >
      {pending ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : action === "trial" ? (
        <CreditCard aria-hidden="true" />
      ) : null}
      {label}
    </Button>
  );
}
