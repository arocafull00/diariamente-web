import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { requireUser } from "@/server/auth/get-current-profile";

export default async function OnboardingPage() {
  await requireUser();

  return (
    <div className="relative flex min-h-svh flex-1 flex-col overflow-hidden">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 sm:py-8">
        <OnboardingWizard />
      </main>
    </div>
  );
}
