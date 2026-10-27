"use client";

import { LoaderCircle } from "lucide-react";

import { TapButton } from "@/components/motion/tap-button";

type WelcomeContinueButtonProps = {
  label: string;
  disabled: boolean;
  pending: boolean;
  onClick: () => void;
};

export function WelcomeContinueButton({
  label,
  disabled,
  pending,
  onClick,
}: WelcomeContinueButtonProps) {
  return (
    <TapButton
      type="button"
      className="btn-raised-joy flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-extrabold tracking-wide text-mood-foreground uppercase outline-none focus-visible:ring-4 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40"
      disabled={disabled || pending}
      onClick={onClick}
    >
      {pending ? (
        <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
      ) : null}
      {label}
    </TapButton>
  );
}
