import { Illustration } from "@/components/faces/illustration";
import type { OnboardingAchievement } from "@/components/onboarding/onboarding-content";

type OnboardingAchievementItemProps = {
  achievement: OnboardingAchievement;
};

export function OnboardingAchievementItem({ achievement }: OnboardingAchievementItemProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <Illustration name={achievement.icon} className="size-10" />
      <div className="min-w-0">
        <p className="text-[0.95rem] font-semibold">{achievement.title}</p>
        <p className="text-sm leading-5 text-foreground/65">{achievement.description}</p>
      </div>
    </li>
  );
}
