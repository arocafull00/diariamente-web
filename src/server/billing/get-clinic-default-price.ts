import { getStripe } from "./stripe";

export async function getClinicDefaultPriceCents() {
  const priceId = process.env.STRIPE_CLINIC_DEFAULT_PRICE_ID;

  if (!priceId) {
    return null;
  }

  const price = await getStripe().prices.retrieve(priceId);

  return price.unit_amount;
}
