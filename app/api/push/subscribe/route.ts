import webpush from "web-push";

import { savePushSubscription } from "@/server/actions/reminders";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body?.subscription?.endpoint || !body?.subscription?.keys) {
    return Response.json({ error: "Invalid subscription" }, { status: 400 });
  }

  const result = await savePushSubscription({
    endpoint: body.subscription.endpoint,
    keys: {
      p256dh: body.subscription.keys.p256dh,
      auth: body.subscription.keys.auth,
    },
  });

  if (result.error) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json({ success: true });
}
