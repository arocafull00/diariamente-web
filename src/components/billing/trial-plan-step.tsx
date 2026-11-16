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

      <section className="flex flex-col items-center gap-1 py-2 text-center">
        <p className="text-sm font-bold text-mood-lp-strong">{planName}</p>
        <p className="flex flex-wrap items-baseline justify-center gap-x-1.5">
          <span className="font-display text-5xl font-medium tracking-tight tabular-nums">{price}</span>
          <span className="text-sm font-semibold text-muted-foreground">/mes, IVA incluido</span>
        </p>
      </section>

      {isClinic ? (
        <div className="rounded-2xl bg-mood-lu-soft p-3">
          <p className="text-sm leading-5 text-foreground/75">
            Os llamamos para ajustaros el precio según cuántos psicólogos seáis.
          </p>
        </div>
      ) : null}

      {referrerName ? (
        <div className="rounded-2xl bg-mood-hp-soft p-3">
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
