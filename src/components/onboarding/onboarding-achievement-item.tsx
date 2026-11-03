import { Illustration } from "@/components/faces/illustration";
import type { OnboardingAchievement } from "@/components/onboarding/onboarding-content";

type OnboardingAchievementItemProps = {
  achievement: OnboardingAchievement;
};

export function OnboardingAchievementItem({ achievement }: OnboardingAchievementItemProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <Illustration name={achievement.icon} className="size-10" />
      <p className="min-w-0 text-[0.95rem] font-semibold">{achievement.title}</p>
    </li>
  );
}
