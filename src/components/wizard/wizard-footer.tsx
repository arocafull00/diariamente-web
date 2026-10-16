"use client";

import { ArrowLeft, ArrowRight, LoaderCircle, Save, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

type PrimaryIcon = "continue" | "save" | "create";

type WizardFooterProps = {
  showBack?: boolean;
  onBack?: () => void;
  backDisabled?: boolean;
  primaryLabel: string;
  primaryType?: "button" | "submit";
  primaryDisabled?: boolean;
  primaryPending?: boolean;
  onPrimaryClick?: () => void;
  primaryIcon?: PrimaryIcon;
};

function WizardPrimaryIcon({
  icon,
  pending,
}: {
  icon: PrimaryIcon;
  pending: boolean;
}) {
  if (pending) {
    return <LoaderCircle className="animate-spin" aria-hidden="true" />;
  }

  if (icon === "continue") {
    return <ArrowRight data-icon="inline-end" aria-hidden="true" />;
  }

  if (icon === "create") {
    return <UserCheck data-icon="inline-start" aria-hidden="true" />;
  }

  return <Save data-icon="inline-start" aria-hidden="true" />;
}

export function WizardFooter({
  showBack = false,
  onBack,
  backDisabled = false,
  primaryLabel,
  primaryType = "button",
  primaryDisabled = false,
  primaryPending = false,
  onPrimaryClick,
  primaryIcon = "continue",
}: WizardFooterProps) {
  return (
    <div className="flex items-center gap-3">
      {showBack ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={backDisabled || primaryPending}
          onClick={onBack}
        >
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          Atrás
        </Button>
      ) : null}

      <Button
        type={primaryType}
        size="lg"
        className="flex-1"
        disabled={primaryDisabled || primaryPending}
        onClick={onPrimaryClick}
      >
        {primaryIcon !== "continue" ? (
          <WizardPrimaryIcon icon={primaryIcon} pending={primaryPending} />
        ) : null}
        {primaryLabel}
        {primaryIcon === "continue" ? (
          <WizardPrimaryIcon icon={primaryIcon} pending={primaryPending} />
        ) : null}
      </Button>
    </div>
  );
}
