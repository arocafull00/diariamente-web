import { Check, Gift, Users } from "lucide-react";

import { REFERRAL_BONUS_DAYS } from "@/lib/referrals";

type TrialPlanStepProps = {
  planName: string;
  price: string;
  trialDays: number;
  isClinic: boolean;
  referrerName: string | null;
};

export function TrialPlanStep({
  planName,
  price,
  trialDays,
  isClinic,
  referrerName,
}: TrialPlanStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-center font-display text-[1.75rem] leading-tight font-medium text-balance sm:text-[2.1rem]">
        Tu plan para después de tus{" "}
        <span className="text-mood-lp-strong italic">{trialDays} días gratis</span>
      </h1>

      <section className="rounded-3xl border-2 border-mood-lp-3 bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-mood-lp-strong">{planName}</p>
            <p className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-3xl font-black tracking-tight tabular-nums">{price}</span>
              <span className="text-xs font-semibold text-foreground/65">/mes, IVA incluido</span>
            </p>
          </div>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mood-lp-3 text-mood-foreground">
            <Check className="size-5" strokeWidth={3} aria-hidden="true" />
          </span>
        </div>
      </section>

      {isClinic ? (
        <div className="flex items-start gap-3 rounded-2xl bg-mood-lu-soft p-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-card text-mood-lu-strong">
            <Users className="size-4" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <p className="text-sm leading-5 text-foreground/75">
            Os llamamos para ajustaros el precio según cuántos psicólogos seáis.
          </p>
        </div>
      ) : null}

      {referrerName ? (
        <div className="flex items-start gap-3 rounded-2xl bg-mood-hp-soft p-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-card text-mood-hp-strong">
            <Gift className="size-4" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <p className="text-sm leading-5 text-foreground/75">
            {referrerName} te regala {REFERRAL_BONUS_DAYS} días extra.
          </p>
        </div>
      ) : null}

      <p className="text-center text-sm font-semibold text-foreground/60">
        Hoy no pagas nada y no hace falta tarjeta.
      </p>
    </div>
  );
}
