import { addDays } from "date-fns";
import { and, eq, gte, inArray, isNull, lt } from "drizzle-orm";

import { db } from "@/db";
import { profiles, subscriptions } from "@/db/schema";
import { logger } from "@/lib/logger";
import { sendPushToUser } from "@/server/push/send-push";

const REMINDER_DAYS_BEFORE = 2;

export async function notifyTrialEnding() {
  const now = new Date();
  const from = addDays(now, REMINDER_DAYS_BEFORE);
  const to = addDays(now, REMINDER_DAYS_BEFORE + 1);

  const accounts = await db
    .select({ id: profiles.id })
    .from(profiles)
    .leftJoin(subscriptions, eq(subscriptions.profileId, profiles.id))
    .where(
      and(
        inArray(profiles.role, ["psychologist", "clinic"]),
        gte(profiles.trialEndsAt, from),
        lt(profiles.trialEndsAt, to),
        isNull(subscriptions.status),
      ),
    );

  let failed = 0;

  for (const account of accounts) {
    try {
      await sendPushToUser(account.id, {
        topic: "trial_ending",
        title: "Tu prueba acaba en 2 días",
        body: "Añade tu tarjeta para seguir con DiariaMente sin cortes.",
        url: "/suscripcion",
      });
    } catch (error) {
      failed += 1;
      logger.error("cron.trial_ending.send_failed", error, {
        profileId: account.id,
      });
    }
  }

  logger.info("cron.trial_ending.completed", { sent: accounts.length, failed });

  return accounts.length;
}
