import { logger } from "@/lib/logger";

import { getStripe } from "./stripe";

export async function getClinicDefaultPriceCents() {
  const priceId = process.env.STRIPE_CLINIC_DEFAULT_PRICE_ID;

  if (!priceId) {
    return null;
  }

  try {
    const price = await getStripe().prices.retrieve(priceId);
    return price.unit_amount;
  } catch (error) {
    logger.error("billing.clinic_default_price_failed", error);
    return null;
  }
}
