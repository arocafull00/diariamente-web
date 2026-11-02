import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CLINIC_INVITE_COOKIE_NAME } from "@/lib/clinic-invitations";
import { INVITE_COOKIE_NAME } from "@/lib/invitations";
import { getCurrentProfile } from "@/server/auth/get-current-profile";

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/empezar");
  }

  const profile = await getCurrentProfile();

  if (!profile || !profile.onboardingCompleted || !profile.role) {
    redirect("/onboarding");
  }

  const cookieStore = await cookies();

  if (profile.role === "patient") {
    if (cookieStore.get(INVITE_COOKIE_NAME)?.value) {
      redirect("/conectar");
    }

    redirect("/inicio");
  }

  if (profile.role === "psychologist") {
    if (cookieStore.get(CLINIC_INVITE_COOKIE_NAME)?.value) {
      redirect("/unirse-clinica");
    }

    redirect("/pacientes");
  }

  if (profile.role === "clinic") {
    redirect("/clinica");
  }

  redirect("/onboarding");
}
