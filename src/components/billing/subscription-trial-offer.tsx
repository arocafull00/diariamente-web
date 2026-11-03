import { CreditCard, Gift, Receipt, RefreshCw } from "lucide-react";
import Image from "next/image";

import logo from "../../../public/logo.png";

import { SignOutLink } from "@/components/auth/sign-out-link";
import { ReferralCodeForm } from "@/components/referrals/referral-code-form";
import { TRIAL_DAYS, formatMonthlyPrice } from "@/lib/billing";
import { REFERRAL_BONUS_DAYS } from "@/lib/referrals";

import { BillingRedirectButton } from "./billing-redirect-button";
import { SubscriptionPlanRow } from "./subscription-plan-row";
import { SubscriptionTrialBackdrop } from "./subscription-trial-backdrop";

const TRIAL_OFFER_COPY = {
  title: "Empieza tu prueba",
  titleHighlight: "gratuita",
  description: "Usa DiariaMente con tus pacientes sin pagar nada hoy.",
  priceCadence: "/mes, IVA incluido",
  trialTotalLabel: "Total durante la prueba",
  trialTotalValue: formatMonthlyPrice(0),
} as const;

const PLAN_BY_ROLE = {
  psychologist: { name: "DiariaMente Profesional", cycle: "Mensual, por profesional" },
  clinic: { name: "DiariaMente Clínica", cycle: "Mensual, por clínica" },
} as const;

type SubscriptionTrialOfferProps = {
  eyebrow: string;
  role: keyof typeof PLAN_BY_ROLE;
  monthlyPriceCents: number;
  referrerName: string | null;
  showReferralForm: boolean;
  pendingReferralCode: string | undefined;
};

export function SubscriptionTrialOffer({
  eyebrow,
  role,
  monthlyPriceCents,
  referrerName,
  showReferralForm,
  pendingReferralCode,
}: SubscriptionTrialOfferProps) {
  const plan = PLAN_BY_ROLE[role];
  const price = formatMonthlyPrice(monthlyPriceCents);
  const trialDays = TRIAL_DAYS + (referrerName ? REFERRAL_BONUS_DAYS : 0);
  const rows = [
    {
      icon: "prueba-gratuita",
      iconClassName: "bg-mood-lp-soft text-mood-lp-strong",
      label: "Días de prueba gratuita",
      value: String(trialDays),
    },
    ...(referrerName
      ? [
          {
            icon: Gift,
            iconClassName: "bg-mood-hp-soft text-mood-hp-strong",
            label: `Regalo de ${referrerName}`,
            value: `+${REFERRAL_BONUS_DAYS} días`,
          },
        ]
      : []),
    {
      icon: CreditCard,
      iconClassName: "bg-mood-lu-soft text-mood-lu-strong",
      label: "Tarjeta requerida para empezar",
      value: "No",
    },
    {
      icon: RefreshCw,
      iconClassName: "bg-mood-hp-soft text-mood-hp-strong",
      label: "Ciclo de facturación",
      value: plan.cycle,
    },
    {
      icon: Receipt,
      iconClassName: "bg-mood-hu-soft text-mood-hu-strong",
      label: "Al finalizar la prueba",
      value: `${price}/mes con tarjeta`,
    },
  ] as const;

  return (
    <main className="relative isolate flex flex-1 flex-col items-center px-5 sm:px-6">
      <SubscriptionTrialBackdrop />

      <header className="relative z-10 flex items-center justify-center gap-2 pt-5">
        <Image src={logo} alt="" width={28} height={28} priority className="size-7 rounded-lg" />
        <span className="text-base font-bold tracking-tight text-primary">Diariamente</span>
      </header>

      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col justify-center py-4">
        <div className="text-center">
          {eyebrow ? (
            <p className="inline-flex rounded-full bg-mood-lp-soft px-3 py-0.5 text-sm font-bold text-mood-lp-strong">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 text-balance font-heading text-[1.75rem] font-black leading-[1.08] tracking-[-0.05em] sm:text-[2.1rem]">
            {TRIAL_OFFER_COPY.title}{" "}
            <span className="text-mood-lp-strong">{TRIAL_OFFER_COPY.titleHighlight}</span>
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-5 text-foreground/70">
            {TRIAL_OFFER_COPY.description}
          </p>
        </div>

        <section
          aria-labelledby="subscription-plan-title"
          className="mt-6 overflow-hidden rounded-3xl border-2 border-border bg-card shadow-sm"
        >
          <div className="flex items-center justify-between gap-4 bg-mood-lp-soft px-4 py-3.5">
            <div className="min-w-0">
              <p id="subscription-plan-title" className="text-sm font-bold text-mood-lp-strong">
                {plan.name}
              </p>
              <p className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="text-3xl font-black tracking-tight tabular-nums">{price}</span>
                <span className="text-xs font-semibold text-foreground/65">
                  {TRIAL_OFFER_COPY.priceCadence}
                </span>
              </p>
            </div>
            <span className="shrink-0 rotate-3 rounded-2xl bg-mood-lp-3 px-3 py-1.5 text-center text-mood-foreground shadow-sm">
              <span className="block text-xl leading-none font-black tabular-nums">{trialDays}</span>
              <span className="block text-[0.6rem] font-extrabold tracking-wide uppercase">
                días gratis
              </span>
            </span>
          </div>

          <dl className="divide-y divide-border px-4">
            {rows.map((row) => (
              <SubscriptionPlanRow key={row.label} {...row} />
            ))}
          </dl>

          <div className="flex items-baseline justify-between gap-4 border-t-2 border-border px-4 py-3">
            <span className="text-sm font-semibold text-foreground/65">
              {TRIAL_OFFER_COPY.trialTotalLabel}
            </span>
            <span className="text-xl font-black text-mood-lp-strong tabular-nums">
              {TRIAL_OFFER_COPY.trialTotalValue}
            </span>
          </div>
        </section>

        {showReferralForm ? <ReferralCodeForm defaultCode={pendingReferralCode} /> : null}
      </div>

      <div className="sticky bottom-0 z-10 -mx-5 flex w-[calc(100%+2.5rem)] flex-col items-center gap-1 bg-linear-to-t from-background from-75% to-transparent px-5 pt-6 pb-[max(1rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6">
        <div className="flex w-full max-w-md flex-col gap-1">
          <BillingRedirectButton
            action="trial"
            className="h-14 w-full rounded-2xl text-base font-extrabold tracking-wide uppercase"
          />
          <SignOutLink className="py-1.5" />
        </div>
      </div>
    </main>
  );
}
