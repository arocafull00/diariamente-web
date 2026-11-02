import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  BadgeCheck,
  Building2,
  CircleAlert,
  Clock,
  Gift,
  type LucideIcon,
} from "lucide-react";

import { formatMonthlyPrice } from "@/lib/billing";
import type { getBillingSummary } from "@/server/billing/get-billing-summary";

export type BillingSummary = Awaited<ReturnType<typeof getBillingSummary>>;

type BillingStatusCopy = {
  icon: LucideIcon;
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
        "No hemos podido cobrar tu suscripción. Actualiza tu método de pago para no perder el acceso.",
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
      icon: BadgeCheck,
      title: "Suscripción activa",
      description: periodEnd
        ? `Estás en tu mes gratuito. El primer cobro${priceLabel ? ` de ${priceLabel}` : ""} será el ${periodEnd}.`
        : "Estás en tu mes gratuito.",
      canSubscribe: false,
      canManage: true,
    };
  }

  return {
    icon: BadgeCheck,
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
      icon: Gift,
      title: "Acceso gratuito de por vida",
      description: "Tu cuenta tiene acceso completo a DiariaMente sin coste.",
      canSubscribe: false,
      canManage: summary.hasCustomer,
    };
  }

  if (summary.access === "clinic") {
    return {
      icon: Building2,
      title: "Incluido en tu clínica",
      description: summary.clinicName
        ? `Tu acceso lo cubre ${summary.clinicName}.`
        : "Tu acceso lo cubre tu clínica.",
      canSubscribe: false,
      canManage: summary.hasCustomer,
    };
  }

  if (summary.access === "trial_available") {
    return {
      icon: Gift,
      title: "Empieza tu mes gratuito",
      description: hasPrice
        ? "Prueba DiariaMente gratis durante 30 días. Hoy no se te cobra nada."
        : "Estamos preparando tu precio. Escríbenos y te lo enviaremos para que puedas empezar tu mes gratuito.",
      canSubscribe: hasPrice,
      canManage: false,
    };
  }

  if (summary.access === "trial" && summary.trialEndsAt) {
    const trialEnd = formatDay(summary.trialEndsAt);

    return {
      icon: Clock,
      title: "Mes gratuito",
      description: hasPrice
        ? `Gratis hasta el ${trialEnd}. Si te suscribes ahora no se te cobrará nada hasta esa fecha.`
        : `Gratis hasta el ${trialEnd}. Te enviaremos tu precio personalizado antes de que termine.`,
      canSubscribe: hasPrice,
      canManage: false,
    };
  }

  return {
    icon: CircleAlert,
    title: "Tu mes gratuito ha terminado",
    description: hasPrice
      ? `Suscríbete por ${getPriceLabel(summary)} para seguir usando DiariaMente con tus pacientes.`
      : "Escríbenos y te ofreceremos un precio personalizado para tu clínica.",
    canSubscribe: hasPrice,
    canManage: summary.hasCustomer,
  };
}
