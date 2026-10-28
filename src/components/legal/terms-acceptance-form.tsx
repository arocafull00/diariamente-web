"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { OnboardingLegalAcceptance } from "@/components/onboarding/onboarding-legal-acceptance";
import { WelcomeContinueButton } from "@/components/onboarding/welcome-continue-button";
import { acknowledgeScreen } from "@/server/actions/required-screens";

export function TermsAcceptanceForm() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [pending, startTransition] = useTransition();

  function accept() {
    startTransition(async () => {
      const result = await acknowledgeScreen("terms");

      if (result.error) {
        toast.error(result.error);
        return;
      }

      router.replace("/");
    });
  }

  return (
    <div className="space-y-6">
      <OnboardingLegalAcceptance checked={accepted} onChange={setAccepted} />
      <WelcomeContinueButton
        label="Continuar"
        disabled={!accepted}
        pending={pending}
        onClick={accept}
      />
    </div>
  );
}
