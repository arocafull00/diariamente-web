import { auth } from "@clerk/nextjs/server";

import { logger } from "@/lib/logger";
import { savePushSubscription } from "@/server/actions/reminders";

export async function POST(req: Request) {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch((error: unknown) => {
    logger.warn("push.subscribe.invalid_json", {
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return null;
  });

  if (!body?.subscription?.endpoint || !body?.subscription?.keys) {
    logger.warn("push.subscribe.invalid_subscription");
    return Response.json({ error: "Invalid subscription" }, { status: 400 });
  }

  try {
    const result = await savePushSubscription({
      endpoint: body.subscription.endpoint,
      keys: {
        p256dh: body.subscription.keys.p256dh,
        auth: body.subscription.keys.auth,
      },
    });

    if (result.error) {
      logger.warn("push.subscribe.rejected", { reason: result.error });
      return Response.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    logger.error("push.subscribe.save_failed", error);
    return Response.json({ error: "Could not save subscription" }, { status: 500 });
  }

  return Response.json({ success: true });
}
