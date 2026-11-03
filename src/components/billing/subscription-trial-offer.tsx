import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

import logo from "../../../public/logo.png";

import { TRIAL_DAYS, formatMonthlyPrice } from "@/lib/billing";
import { REFERRAL_BONUS_DAYS } from "@/lib/referrals";

import { SubscriptionTrialFlow } from "./subscription-trial-flow";

const REMINDER_DAYS_BEFORE = 2;

const PLAN_NAME_BY_ROLE = {
  psychologist: "DiariaMente Profesional",
  clinic: "DiariaMente Clínica",
} as const;

type SubscriptionTrialOfferProps = {
  role: keyof typeof PLAN_NAME_BY_ROLE;
  monthlyPriceCents: number;
  referrerName: string | null;
  showReferralForm: boolean;
  pendingReferralCode: string | undefined;
};

export function SubscriptionTrialOffer({
  role,
  monthlyPriceCents,
  referrerName,
  showReferralForm,
  pendingReferralCode,
}: SubscriptionTrialOfferProps) {
  const trialDays = TRIAL_DAYS + (referrerName ? REFERRAL_BONUS_DAYS : 0);
  const reminderDate = format(
    addDays(new Date(), trialDays - REMINDER_DAYS_BEFORE),
    "d 'de' MMMM",
    { locale: es },
  );

  return (
    <main className="relative isolate flex flex-1 flex-col items-center px-5 sm:px-6">
      <header className="relative z-10 flex items-center justify-center gap-2 pt-5">
        <Image src={logo} alt="" width={28} height={28} priority className="size-7 rounded-lg" />
        <span className="text-base font-bold tracking-tight text-primary">Diariamente</span>
      </header>

      <SubscriptionTrialFlow
        planName={PLAN_NAME_BY_ROLE[role]}
        price={formatMonthlyPrice(monthlyPriceCents)}
        trialDays={trialDays}
        reminderDate={reminderDate}
        isClinic={role === "clinic"}
        referrerName={referrerName}
        showReferralForm={showReferralForm}
        pendingReferralCode={pendingReferralCode}
      />
    </main>
  );
}
