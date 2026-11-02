"use client";

import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { openBillingPortal, startCheckout } from "@/server/actions/billing";

const BILLING_ACTIONS = {
  checkout: { run: startCheckout, label: "Suscribirme" },
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
  const [pending, startTransition] = useTransition();
  const { run, label } = BILLING_ACTIONS[action];

  function handleClick() {
    startTransition(async () => {
      const result = await run();

      if (result.error || !result.url) {
        toast.error(result.error ?? "No se pudo continuar");
        return;
      }

      window.location.assign(result.url);
    });
  }

  return (
    <Button
      variant={action === "checkout" ? "default" : "outline"}
      className={cn(action === "checkout" && "btn-raised", className)}
      disabled={pending}
      onClick={handleClick}
    >
      {pending ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : null}
      {label}
    </Button>
  );
}
