import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { getCurrentProfile } from "@/server/auth/get-current-profile";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (userId) {
    const profile = await getCurrentProfile();

    if (profile?.onboardingCompleted && profile.role) {
      redirect("/");
    }
  }

  return (
    <div className="relative flex min-h-svh flex-1 flex-col overflow-x-clip">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 sm:pt-8">
        <OnboardingFlow />
      </main>
    </div>
  );
}
