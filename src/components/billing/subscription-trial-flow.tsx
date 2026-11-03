"use client";

import { useState } from "react";

import { SignOutLink } from "@/components/auth/sign-out-link";
import { ReferralCodeForm } from "@/components/referrals/referral-code-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { BillingRedirectButton } from "./billing-redirect-button";
import { TrialPlanStep } from "./trial-plan-step";
import { TrialReminderStep } from "./trial-reminder-step";

type SubscriptionTrialFlowProps = {
  planName: string;
  price: string;
  trialDays: number;
  reminderDate: string;
  isClinic: boolean;
  referrerName: string | null;
  showReferralForm: boolean;
  pendingReferralCode: string | undefined;
};

export function SubscriptionTrialFlow({
  planName,
  price,
  trialDays,
  reminderDate,
  isClinic,
  referrerName,
  showReferralForm,
  pendingReferralCode,
}: SubscriptionTrialFlowProps) {
  const [showReminder, setShowReminder] = useState(false);
  const ctaClassName = "h-14 w-full rounded-2xl text-base font-extrabold tracking-wide uppercase";

  return (
    <>
      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col justify-center py-4">
        {showReminder ? (
          <TrialReminderStep reminderDate={reminderDate} />
        ) : (
          <TrialPlanStep
            planName={planName}
            price={price}
            trialDays={trialDays}
            isClinic={isClinic}
            referrerName={referrerName}
          />
        )}

        {!showReminder && showReferralForm ? (
          <ReferralCodeForm defaultCode={pendingReferralCode} />
        ) : null}
      </div>

      <div className="sticky bottom-0 z-10 -mx-5 flex w-[calc(100%+2.5rem)] flex-col items-center gap-1 bg-linear-to-t from-background from-75% to-transparent px-5 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6">
        <div className="flex w-full max-w-md flex-col gap-1">
          {showReminder ? (
            <BillingRedirectButton action="trial" className={ctaClassName} />
          ) : (
            <Button
              className={cn("btn-raised-joy text-mood-foreground", ctaClassName)}
              onClick={() => setShowReminder(true)}
            >
              Empezar mi prueba gratuita
            </Button>
          )}
          <SignOutLink className="py-1.5" />
        </div>
      </div>
    </>
  );
}
