import { eq } from "drizzle-orm";
import webpush from "web-push";

import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";

type PushTopic =
  | "connection_request"
  | "connection_resolved"
  | "patient_record"
  | "reminder"
  | "account_inactivity";

type PushPayload = {
  topic: PushTopic;
  title: string;
  body: string;
  url: string;
};

let vapidConfigured = false;

function ensureVapidConfigured() {
  if (vapidConfigured) {
    return true;
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails("mailto:support@diariamente.app", publicKey, privateKey);
  vapidConfigured = true;

  return true;
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  if (!ensureVapidConfigured()) {
    return 0;
  }

  const subscriptions = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  let delivered = 0;

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        JSON.stringify(payload),
      );
      delivered += 1;
    } catch {
      await db
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.id, subscription.id));
    }
  }

  return delivered;
}
