import { and, eq, notExists, sql } from "drizzle-orm";

import { db } from "@/db";
import { patientRecords, userReminders } from "@/db/schema";
import { APP_TIME_ZONE, getDateKey } from "@/lib/dates";
import { logger } from "@/lib/logger";
import { isCronRequest } from "@/server/auth/require-admin-api";
import { notifyTrialEnding } from "@/server/billing/notify-trial-ending";
import { sendPushToUser } from "@/server/push/send-push";

const REMINDER_MESSAGES = [
  {
    title: "¿Cómo ha ido tu día?",
    body: "Si te apetece, tómate un momento para registrar cómo te sientes.",
  },
  {
    title: "Un momento para ti",
    body: "Poner nombre a lo que sientes hoy te llevará solo un minuto.",
  },
  {
    title: "¿Qué tal estás?",
    body: "Cuando quieras, apunta lo que has sentido hoy.",
  },
  {
    title: "Tu registro de hoy",
    body: "Todas las emociones cuentan. Si quieres, déjalas por escrito.",
  },
  {
    title: "Antes de cerrar el día",
    body: "Un registro corto ayuda a darte cuenta de cómo has estado.",
  },
];

function getDailyMessage(now: Date) {
  const dayNumber = Math.floor(
    new Date(getDateKey(now)).getTime() / (24 * 60 * 60 * 1000),
  );

  return REMINDER_MESSAGES[dayNumber % REMINDER_MESSAGES.length];
}

export async function GET(req: Request) {
  if (!isCronRequest(req)) {
    logger.warn("cron.reminders.unauthorized");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reminders = await db
    .select({ userId: userReminders.userId })
    .from(userReminders)
    .where(
      and(
        eq(userReminders.enabled, true),
        notExists(
          db
            .select({ id: patientRecords.id })
            .from(patientRecords)
            .where(
              and(
                eq(patientRecords.patientId, userReminders.userId),
                sql`(${patientRecords.createdAt} at time zone ${APP_TIME_ZONE})::date = (now() at time zone ${APP_TIME_ZONE})::date`,
              ),
            ),
        ),
      ),
    );

  const message = getDailyMessage(new Date());
  let failed = 0;

  for (const reminder of reminders) {
    try {
      await sendPushToUser(reminder.userId, {
        topic: "reminder",
        ...message,
        url: "/nuevo-registro",
      });
    } catch (error) {
      failed += 1;
      logger.error("cron.reminders.send_failed", error, {
        userId: reminder.userId,
      });
    }
  }

  await notifyTrialEnding().catch((error: unknown) => {
    logger.error("cron.trial_ending.failed", error);
  });

  logger.info("cron.reminders.completed", { sent: reminders.length, failed });

  return Response.json({ sent: reminders.length });
}
