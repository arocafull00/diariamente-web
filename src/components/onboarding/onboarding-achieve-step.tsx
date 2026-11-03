import { OnboardingAchievementItem } from "@/components/onboarding/onboarding-achievement-item";
import { PATIENT_ACHIEVEMENTS } from "@/components/onboarding/onboarding-content";
import { OnboardingEvolutionChart } from "@/components/onboarding/onboarding-evolution-chart";

export function OnboardingAchieveStep() {
  return (
    <div className="flex flex-col gap-4">
      <OnboardingEvolutionChart />
      <ul className="divide-y divide-border/70 overflow-hidden rounded-3xl border-2 border-border bg-card">
        {PATIENT_ACHIEVEMENTS.map((achievement) => (
          <OnboardingAchievementItem key={achievement.title} achievement={achievement} />
        ))}
      </ul>
    </div>
  );
}
