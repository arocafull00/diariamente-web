import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function deleteProfileAndIdentity(userId: string) {
  await db.delete(profiles).where(eq(profiles.id, userId));

  const client = await clerkClient();
  await client.users.deleteUser(userId);
}
