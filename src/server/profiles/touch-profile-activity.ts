import { and, eq, lt } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";

const ACTIVITY_THROTTLE_MS = 60 * 60 * 1000;

export async function touchProfileActivity(userId: string) {
  const now = new Date();

  await db
    .update(profiles)
    .set({ lastActiveAt: now })
    .where(
      and(
        eq(profiles.id, userId),
        lt(profiles.lastActiveAt, new Date(now.getTime() - ACTIVITY_THROTTLE_MS)),
      ),
    );
}
