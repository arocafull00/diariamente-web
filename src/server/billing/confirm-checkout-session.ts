import { getStripe } from "./stripe";
import { syncSubscription } from "./sync-subscription";

export async function confirmCheckoutSession(sessionId: string, profileId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  if (
    session.client_reference_id !== profileId ||
    !session.subscription ||
    typeof session.subscription === "string"
  ) {
    return;
  }

  await syncSubscription(session.subscription);
}
