"use client";

import { CircleAlert } from "lucide-react";
import Link from "next/link";

import { PRIVACY_POLICY_PATH } from "@/lib/privacy";

type OnboardingLegalAcceptanceProps = {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
};

export function OnboardingLegalAcceptance({
  checked,
  error,
  onChange,
}: OnboardingLegalAcceptanceProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3 rounded-2xl border border-transparent bg-secondary p-4 text-sm leading-6 transition-colors has-[:checked]:border-mood-lp-strong/30 has-[:checked]:bg-mood-lp-soft">
        <input
          id="legalAccepted"
          type="checkbox"
          checked={checked}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "legalAccepted-error" : undefined}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-mood-lp-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        />
        <label htmlFor="legalAccepted" className="cursor-pointer">
          Acepto los{" "}
          <Link
            href="/terminos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4"
          >
            términos de servicio
          </Link>{" "}
          y la{" "}
          <Link
            href={PRIVACY_POLICY_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4"
          >
            política de privacidad
          </Link>
          .
        </label>
      </div>
      {error ? (
        <p
          id="legalAccepted-error"
          className="flex items-center gap-1.5 text-sm font-medium text-destructive"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
