import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function ensureProfile(userId: string) {
  const [existing] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (existing) {
    return;
  }

  await db.insert(profiles).values({
    id: userId,
    onboardingCompleted: false,
  });
}
