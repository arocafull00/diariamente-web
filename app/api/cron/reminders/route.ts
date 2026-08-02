import { eq } from "drizzle-orm";
import webpush from "web-push";

import { db } from "@/db";
import { pushSubscriptions, userReminders } from "@/db/schema";

function shouldSendReminder(
  settings: typeof userReminders.$inferSelect,
  now: Date,
) {
  if (!settings.enabled) {
    return false;
  }

  const [hours, minutes] = settings.time.split(":").map(Number);
  const currentHour = now.getUTCHours();
  const currentMinute = now.getUTCMinutes();

  if (currentHour !== hours || currentMinute !== minutes) {
    return false;
  }

  if (settings.frequency === "daily") {
    return true;
  }

  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = dayNames[now.getUTCDay()];

  return settings.days.includes(today);
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return Response.json({ error: "VAPID not configured" }, { status: 500 });
  }

  webpush.setVapidDetails(
    "mailto:support@diariamente.app",
    publicKey,
    privateKey,
  );

  const now = new Date();
  const reminders = await db.select().from(userReminders);
  const eligible = reminders.filter((reminder) => shouldSendReminder(reminder, now));

  let sent = 0;

  for (const reminder of eligible) {
    const subscriptions = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, reminder.userId));

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
          JSON.stringify({
            title: "¿Deseas crear algún registro?",
            body: "Es hora de registrar tu estado emocional del día.",
          }),
        );
        sent += 1;
      } catch {
        await db
          .delete(pushSubscriptions)
          .where(eq(pushSubscriptions.id, subscription.id));
      }
    }
  }

  return Response.json({ sent, eligible: eligible.length });
}
