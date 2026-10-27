import type { WelcomeGoal } from "@/components/onboarding/welcome-content";
import { WelcomeGoalOption } from "@/components/onboarding/welcome-goal-option";

type WelcomeGoalListProps = {
  goals: readonly WelcomeGoal[];
  selectedId: string | null;
  onSelect: (goalId: string) => void;
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
