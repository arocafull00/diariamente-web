import { db } from "@/db";
import { userReminders } from "@/db/schema";
import { sendPushToUser } from "@/server/push/send-push";

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

  const now = new Date();
  const reminders = await db.select().from(userReminders);
  const eligible = reminders.filter((reminder) => shouldSendReminder(reminder, now));

  for (const reminder of eligible) {
    await sendPushToUser(reminder.userId, {
      topic: "reminder",
      title: "¿Deseas crear algún registro?",
      body: "Es hora de registrar tu estado emocional del día.",
      url: "/nuevo-registro",
    });
  }

  return Response.json({ sent: eligible.length, eligible: eligible.length });
}
