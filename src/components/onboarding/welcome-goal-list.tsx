import type { WelcomeGoal } from "@/components/onboarding/welcome-content";
import { WelcomeGoalOption } from "@/components/onboarding/welcome-goal-option";
import type { OnboardingGoal } from "@/db/schema";

type WelcomeGoalListProps = {
  goals: readonly WelcomeGoal[];
  selectedId: OnboardingGoal | null;
  onSelect: (goalId: OnboardingGoal) => void;
};

export function WelcomeGoalList({
  goals,
  selectedId,
  onSelect,
}: WelcomeGoalListProps) {
  return (
    <ul role="radiogroup" aria-label="Tu objetivo" className="space-y-3">
      {goals.map((goal) => (
        <WelcomeGoalOption
          key={goal.id}
          goal={goal}
          selected={goal.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
