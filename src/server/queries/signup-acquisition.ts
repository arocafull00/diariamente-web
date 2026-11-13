import { count, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { profiles, signupAttribution } from "@/db/schema";

export async function getUsersSignupAttribution(ids: string[]) {
  return db.select().from(signupAttribution).where(inArray(signupAttribution.profileId, ids));
}

export async function getSignupSummary(period: number) {
  const registeredAt = sql<Date>`coalesce(${signupAttribution.registeredAt}, ${profiles.createdAt})`;
  return db.select({
    channel: signupAttribution.channel,
    platform: signupAttribution.platform,
    landingHost: signupAttribution.landingHost,
    signups: count(profiles.id),
  }).from(profiles)
    .leftJoin(signupAttribution, eq(signupAttribution.profileId, profiles.id))
    .where(period ? gte(registeredAt, new Date(Date.now() - period * 86400000)) : undefined)
    .groupBy(signupAttribution.channel, signupAttribution.platform, signupAttribution.landingHost);
}
