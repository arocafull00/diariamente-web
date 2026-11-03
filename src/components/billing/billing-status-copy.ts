import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CircleAlert, Clock, type LucideIcon } from "lucide-react";

import { formatMonthlyPrice } from "@/lib/billing";
import type { IllustrationName } from "@/lib/illustrations";
import type { getBillingSummary } from "@/server/billing/get-billing-summary";

export type BillingSummary = Awaited<ReturnType<typeof getBillingSummary>>;

type BillingStatusCopy = {
  icon: LucideIcon | IllustrationName;
  title: string;
  description: string;
  canSubscribe: boolean;
  canManage: boolean;
};

function formatDay(date: Date) {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
}

function getPriceLabel(summary: BillingSummary) {
  return summary.monthlyPriceCents === null
    ? null
    : `${formatMonthlyPrice(summary.monthlyPriceCents)}/mes`;
}

function getSubscribedCopy(summary: BillingSummary): BillingStatusCopy {
  const priceLabel = getPriceLabel(summary);
  const periodEnd = summary.currentPeriodEnd
    ? formatDay(summary.currentPeriodEnd)
    : null;

  if (summary.subscriptionStatus === "past_due") {
    return {
      icon: CircleAlert,
      title: "Pago pendiente",
      description:
        "No hemos podido cobrar tu suscripción. Actualiza tu método de pago y seguimos como siempre.",
      canSubscribe: false,
      canManage: true,
    };
  }

  if (summary.cancelAtPeriodEnd) {
    return {
      icon: Clock,
      title: "Suscripción cancelada",
      description: periodEnd
        ? `Mantienes el acceso hasta el ${periodEnd}.`
        : "Mantienes el acceso hasta el final del periodo actual.",
      canSubscribe: false,
      canManage: true,
    };
  }

  if (summary.subscriptionStatus === "trialing") {
    return {
      icon: "prueba-gratuita",
      title: "Suscripción activa",
      description: periodEnd
        ? `¡Disfrutando gratis hasta el ${periodEnd}!`
        : "¡Estás disfrutando de tu prueba gratis!",
      canSubscribe: false,
      canManage: true,
    };
  }

  return {
    icon: "aceptar-invitacion",
    title: "Suscripción activa",
    description: [priceLabel, periodEnd ? `se renueva el ${periodEnd}` : null]
      .filter(Boolean)
      .join(" · "),
    canSubscribe: false,
    canManage: true,
  };
}

export function getBillingStatusCopy(summary: BillingSummary): BillingStatusCopy {
  const hasPrice = summary.monthlyPriceCents !== null;

  if (summary.access === "subscribed") {
    return getSubscribedCopy(summary);
  }

  if (summary.access === "lifetime") {
    return {
      icon: "aceptar-invitacion",
      title: "Acceso gratuito de por vida",
      description: "Tienes DiariaMente completo y gratis. ¡Que lo disfrutes!",
      canSubscribe: false,
      canManage: summary.hasCustomer,
    };
  }

  if (summary.access === "clinic") {
    return {
      icon: "equipo",
      title: "Incluido en tu clínica",
      description: summary.clinicName
        ? `${summary.clinicName} se encarga de tu suscripción.`
        : "Tu clínica se encarga de tu suscripción.",
      canSubscribe: false,
      canManage: summary.hasCustomer,
    };
  }

  if (summary.access === "trial_available") {
    return {
      icon: "prueba-gratuita",
      title: "Empieza tu mes gratuito",
      description: hasPrice
        ? "Prueba DiariaMente 30 días gratis. Hoy no pagas nada."
        : "Estamos preparando tu precio. Escríbenos y te lo mandamos para que empieces tu mes gratis.",
      canSubscribe: hasPrice,
      canManage: false,
    };
  }

  if (summary.access === "trial" && summary.trialEndsAt) {
    const trialEnd = formatDay(summary.trialEndsAt);

    return {
      icon: "prueba-gratuita",
      title: "Mes gratuito",
      description: hasPrice
        ? `Gratis hasta el ${trialEnd}. Si te suscribes ahora, no pagas nada hasta entonces.`
        : `Gratis hasta el ${trialEnd}. Te enviaremos tu precio personalizado antes de que termine.`,
      canSubscribe: hasPrice,
      canManage: false,
    };
  }

  return {
    icon: CircleAlert,
    title: "Tu mes gratis se ha acabado",
    description: hasPrice
      ? `Suscríbete por ${getPriceLabel(summary)} y sigue acompañando a tus pacientes con DiariaMente.`
      : "Escríbenos y te ofreceremos un precio personalizado para tu clínica.",
    canSubscribe: hasPrice,
    canManage: summary.hasCustomer,
  };
}
