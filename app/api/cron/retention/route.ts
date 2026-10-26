import { addDays, subDays, subMonths } from "date-fns";
import { and, gte, lt } from "drizzle-orm";

import { db } from "@/db";
import { auditEvents, profiles } from "@/db/schema";
import {
  AUDIT_RETENTION_MONTHS,
  INACTIVE_ACCOUNT_RETENTION_MONTHS,
  INACTIVE_ACCOUNT_WARNING_DAYS,
} from "@/lib/privacy";
import { deleteProfileAndIdentity } from "@/server/profiles/delete-profile";
import { sendPushToUser } from "@/server/push/send-push";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const deletionCutoff = subMonths(now, INACTIVE_ACCOUNT_RETENTION_MONTHS);
  const warningCutoff = addDays(deletionCutoff, INACTIVE_ACCOUNT_WARNING_DAYS);

  const [toWarn, toDelete] = await Promise.all([
    db
      .select({ id: profiles.id })
      .from(profiles)
      .where(
        and(
          lt(profiles.lastActiveAt, warningCutoff),
          gte(profiles.lastActiveAt, subDays(warningCutoff, 1)),
        ),
      ),
    db
      .select({ id: profiles.id })
      .from(profiles)
      .where(lt(profiles.lastActiveAt, deletionCutoff)),
  ]);

  for (const profile of toWarn) {
    await sendPushToUser(profile.id, {
      topic: "account_inactivity",
      title: "Tu cuenta se eliminará pronto",
      body: `Por inactividad, tu cuenta se eliminará en ${INACTIVE_ACCOUNT_WARNING_DAYS} días. Abre la app para conservarla.`,
      url: "/",
    });
  }

  let deleted = 0;

  for (const profile of toDelete) {
    try {
      await deleteProfileAndIdentity(profile.id);
      deleted += 1;
    } catch {
      continue;
    }
  }

  const prunedEvents = await db
    .delete(auditEvents)
    .where(lt(auditEvents.createdAt, subMonths(now, AUDIT_RETENTION_MONTHS)))
    .returning({ id: auditEvents.id });

  return Response.json({
    warned: toWarn.length,
    deleted,
    prunedEvents: prunedEvents.length,
  });
}
