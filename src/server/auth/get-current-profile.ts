import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { profiles, type Profile } from "@/db/schema";

export async function getCurrentProfile(): Promise<Profile | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  return profile ?? null;
}

export async function requireUser() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  return userId;
}

export async function requireProfile() {
  const userId = await requireUser();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/onboarding");
  }

  if (!profile.onboardingCompleted) {
    redirect("/onboarding");
  }

  return profile;
}

export async function requireRole(role: Profile["role"]) {
  const profile = await requireProfile();

  if (profile.role !== role) {
    redirect("/");
  }

  return profile;
}
