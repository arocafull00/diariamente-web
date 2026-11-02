import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles, type Profile } from "@/db/schema";

import { getStripe } from "./stripe";

export async function ensureStripeCustomer(profile: Profile) {
  if (profile.stripeCustomerId) {
    return profile.stripeCustomerId;
  }

  const client = await clerkClient();
  const user = await client.users.getUser(profile.id);
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  const customer = await getStripe().customers.create(
    {
      email: user.primaryEmailAddress?.emailAddress,
      name: name || undefined,
      metadata: { profileId: profile.id },
    },
    { idempotencyKey: `customer-${profile.id}` },
  );

  await db
    .update(profiles)
    .set({ stripeCustomerId: customer.id, updatedAt: new Date() })
    .where(eq(profiles.id, profile.id));

  return customer.id;
}
