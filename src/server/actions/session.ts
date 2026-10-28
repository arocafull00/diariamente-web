"use server";

import { auth } from "@clerk/nextjs/server";
import { after } from "next/server";

import { getPendingRequiredScreen } from "@/lib/required-screens";
import { getCurrentProfile } from "@/server/auth/get-current-profile";
import { touchProfileActivity } from "@/server/profiles/touch-profile-activity";
import { getScreenAcknowledgements } from "@/server/queries";

export async function getSessionProfile() {
  const { userId } = await auth();

  if (!userId) {
    return { status: "signed-out" as const };
  }

  const [profile, acknowledgements] = await Promise.all([
    getCurrentProfile(),
    getScreenAcknowledgements(userId),
  ]);

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
    pendingScreenHref:
      getPendingRequiredScreen(profile.role, acknowledgements)?.href ?? null,
  };
}
