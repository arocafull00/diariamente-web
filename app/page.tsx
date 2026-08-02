import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { INVITE_COOKIE_NAME } from "@/lib/invitations";
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
    const cookieStore = await cookies();

    if (cookieStore.get(INVITE_COOKIE_NAME)?.value) {
      redirect("/conectar");
    }

    redirect("/inicio");
  }

  if (profile.role === "psychologist") {
    redirect("/pacientes");
  }

  redirect("/onboarding");
}
