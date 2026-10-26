"use server";

import { auth } from "@clerk/nextjs/server";
import { after } from "next/server";

import { getCurrentProfile } from "@/server/auth/get-current-profile";
import { touchProfileActivity } from "@/server/profiles/touch-profile-activity";

export async function getSessionProfile() {
  const { userId } = await auth();

  if (!userId) {
    return { status: "signed-out" as const };
  }

  const profile = await getCurrentProfile();

  if (!profile || !profile.onboardingCompleted || !profile.role) {
    return { status: "onboarding" as const };
  }

  after(() => touchProfileActivity(profile.id));

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
