import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userReminders } from "@/db/schema";
import { sendPushToUser } from "@/server/push/send-push";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reminders = await db
    .select()
    .from(userReminders)
    .where(eq(userReminders.enabled, true));

  for (const reminder of reminders) {
    await sendPushToUser(reminder.userId, {
      topic: "reminder",
      title: "¿Deseas crear algún registro?",
      body: "Es hora de registrar tu estado emocional del día.",
      url: "/nuevo-registro",
    });
  }

  return Response.json({ sent: reminders.length });
}
