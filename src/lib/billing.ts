import { addDays } from "date-fns";

import type { UserRole } from "@/db/schema";

export const TRIAL_DAYS = 30;
export const CLINIC_PRICE_GRACE_DAYS = 7;
export const PSYCHOLOGIST_MONTHLY_PRICE_CENTS = 999;

const ACCESS_SUBSCRIPTION_STATUSES = ["active", "trialing", "past_due"];

export type BillingAccess =
  | "free"
  | "lifetime"
  | "clinic"
  | "subscribed"
  | "trial"
  | "pricing_pending"
  | "expired";

export type BillingAccount = {
  role: UserRole | null;
  lifetimeAccess: boolean;
  trialEndsAt: Date | null;
  subscriptionStatus: string | null;
  clinicPriceId: string | null;
};

export function hasActiveSubscription(status: string | null) {
  return status !== null && ACCESS_SUBSCRIPTION_STATUSES.includes(status);
}

export function resolveBillingAccess(
  account: BillingAccount,
  coveringClinic: BillingAccount | null,
  now: Date,
): BillingAccess {
  if (account.role !== "psychologist" && account.role !== "clinic") {
    return "free";
  }

  if (account.lifetimeAccess) {
    return "lifetime";
  }

  if (
    coveringClinic &&
    resolveBillingAccess(coveringClinic, null, now) !== "expired"
  ) {
    return "clinic";
  }

  if (hasActiveSubscription(account.subscriptionStatus)) {
    return "subscribed";
  }

  if (account.trialEndsAt && now < account.trialEndsAt) {
    return "trial";
  }

  if (account.role === "clinic" && !account.clinicPriceId) {
    return "pricing_pending";
  }

  return "expired";
}

export function getTrialEnd(from: Date) {
  return addDays(from, TRIAL_DAYS);
}

export function formatMonthlyPrice(cents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
