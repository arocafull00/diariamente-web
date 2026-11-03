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

  try {
    const result = await savePushSubscription(body?.subscription);

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
