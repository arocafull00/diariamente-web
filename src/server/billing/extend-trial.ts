import { addDays } from "date-fns";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function extendTrial(profileId: string, days: number) {
  const until = addDays(new Date(), days).toISOString();

  await db
    .update(profiles)
    .set({
      trialEndsAt: sql`greatest(${profiles.trialEndsAt}, ${until}::timestamptz)`,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, profileId));
}
