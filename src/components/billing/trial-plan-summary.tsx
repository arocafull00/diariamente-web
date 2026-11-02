import { format } from "date-fns";
import { es } from "date-fns/locale";

import type { UserRole } from "@/db/schema";
import { formatMonthlyPrice, getTrialEnd, TRIAL_DAYS } from "@/lib/billing";

import { TrialPlanFeature } from "./trial-plan-feature";
import { TrialPlanRow } from "./trial-plan-row";

const PLAN_FEATURES: Partial<Record<UserRole, { name: string; features: string[] }>> = {
  psychologist: {
    name: "Plan Profesional",
    features: [
      "Invita a tus pacientes con un enlace",
      "Consulta los registros emocionales de tus pacientes vinculados",
      "Tus pacientes usan DiariaMente gratis",
    ],
  },
  clinic: {
    name: "Plan Clínica",
    features: [
      "Invita a los psicólogos/as de tu equipo con un enlace",
      "Su acceso a DiariaMente queda incluido en tu suscripción",
      "Panel con la actividad agregada del equipo, sin datos clínicos de pacientes",
    ],
  },
};

type TrialPlanSummaryProps = {
  role: UserRole;
  monthlyPriceCents: number;
};

export function TrialPlanSummary({ role, monthlyPriceCents }: TrialPlanSummaryProps) {
  const plan = PLAN_FEATURES[role];

  if (!plan) {
    return null;
  }

  const trialEnd = format(getTrialEnd(new Date()), "d 'de' MMMM 'de' yyyy", {
    locale: es,
  });
  const price = `${formatMonthlyPrice(monthlyPriceCents)}/mes`;

  return (
    <section
      aria-labelledby="trial-plan-title"
      className="w-full rounded-3xl bg-card p-6 text-left shadow-sm ring-1 ring-border/60"
    >
      <div className="border-b border-border pb-5">
        <p id="trial-plan-title" className="text-sm font-medium text-primary">
          {plan.name}
        </p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="text-3xl font-semibold tracking-tight">
            {formatMonthlyPrice(monthlyPriceCents)}
          </span>
          <span className="text-sm text-muted-foreground">/mes, IVA incluido</span>
        </p>
      </div>

      <ul className="space-y-2.5 border-b border-border py-5">
        {plan.features.map((feature) => (
          <TrialPlanFeature key={feature} text={feature} />
        ))}
      </ul>

      <dl className="space-y-3 py-5">
        <TrialPlanRow label="Prueba gratuita" value={`${TRIAL_DAYS} días`} />
        <TrialPlanRow label="Gratis hasta" value={trialEnd} />
        <TrialPlanRow label="Después" value={price} />
        <TrialPlanRow label="Tarjeta" value="No necesaria para empezar" />
        <TrialPlanRow label="Permanencia" value="Ninguna" />
      </dl>

      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Hoy no se te cobra nada.</span>{" "}
        Para seguir después del {trialEnd}, añade un método de pago desde
        Gestionar suscripción. Si no lo haces, la suscripción se cancela sola
        y no se te cobrará.
      </p>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-border pt-5">
        <span className="text-sm text-muted-foreground">Total hoy</span>
        <span className="text-xl font-semibold text-primary">
          {formatMonthlyPrice(0)}
        </span>
      </div>
    </section>
  );
}
