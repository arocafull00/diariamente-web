import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/server/auth/get-current-profile";

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const profile = await getCurrentProfile();

  if (!profile || !profile.onboardingCompleted || !profile.role) {
    redirect("/onboarding");
  }

  if (profile.role === "patient") {
    redirect("/inicio");
  }

  if (profile.role === "psychologist") {
    redirect("/pacientes");
  }

  redirect("/onboarding");
}
