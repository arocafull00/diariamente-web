import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userReminders } from "@/db/schema";
import { logger } from "@/lib/logger";
import { sendPushToUser } from "@/server/push/send-push";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("cron.reminders.unauthorized");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reminders = await db
    .select()
    .from(userReminders)
    .where(eq(userReminders.enabled, true));

  let failed = 0;

  for (const reminder of reminders) {
    try {
      await sendPushToUser(reminder.userId, {
        topic: "reminder",
        title: "¿Deseas crear algún registro?",
        body: "Es hora de registrar tu estado emocional del día.",
        url: "/nuevo-registro",
      });
    } catch (error) {
      failed += 1;
      logger.error("cron.reminders.send_failed", error, {
        userId: reminder.userId,
      });
    }
  }

  logger.info("cron.reminders.completed", { sent: reminders.length, failed });

  return Response.json({ sent: reminders.length });
}
