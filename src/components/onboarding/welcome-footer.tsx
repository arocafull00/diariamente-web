"use client";

import { WelcomeContinueButton } from "@/components/onboarding/welcome-continue-button";
import { Button } from "@/components/ui/button";

type WelcomeFooterProps = {
  label: string;
  disabled: boolean;
  pending: boolean;
  offersNotNow: boolean;
  onPrimary: () => void;
  onNotNow: () => void;
};

export function WelcomeFooter({
  label,
  disabled,
  pending,
  offersNotNow,
  onPrimary,
  onNotNow,
}: WelcomeFooterProps) {
  return (
    <div className="mt-auto flex flex-col gap-2 pt-10 lg:mt-0">
      <WelcomeContinueButton
        label={label}
        disabled={disabled}
        pending={pending}
        onClick={onPrimary}
      />
      {offersNotNow ? (
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="w-full rounded-2xl font-bold tracking-wide text-foreground/65 uppercase hover:bg-transparent"
          disabled={pending}
          onClick={onNotNow}
        >
          Por el momento no
        </Button>
      ) : null}
    </div>
  );
}
