"use server";

import { auth } from "@clerk/nextjs/server";

import { getCurrentProfile } from "@/server/auth/get-current-profile";

export async function getSessionProfile() {
  const { userId } = await auth();

  if (!userId) {
    return { status: "signed-out" as const };
  }

  const profile = await getCurrentProfile();

  if (!profile || !profile.onboardingCompleted || !profile.role) {
    return { status: "onboarding" as const };
  }

  return {
    status: "signed-in" as const,
    profile: {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatarUrl: profile.avatarUrl,
      role: profile.role,
    },
  };
}
