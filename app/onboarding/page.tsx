import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <div className="relative flex min-h-svh flex-1 flex-col overflow-hidden">
      <div
        className="auth-soft-background absolute inset-0 -z-10 h-full w-full"
        aria-hidden
      />
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-4 sm:px-8 sm:py-10">
        <OnboardingWizard />
      </main>
    </div>
  );
}
