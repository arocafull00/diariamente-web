import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { profiles, type Profile } from "@/db/schema";
import { generateReferralCode } from "@/lib/referrals";

export async function ensureReferralCode(profile: Profile) {
  if (profile.referralCode) {
    return profile.referralCode;
  }

  const [updated] = await db
    .update(profiles)
    .set({
      referralCode: sql`coalesce(${profiles.referralCode}, ${generateReferralCode()})`,
    })
    .where(eq(profiles.id, profile.id))
    .returning({ referralCode: profiles.referralCode });

  return updated.referralCode!;
}
