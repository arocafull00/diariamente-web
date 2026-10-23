import type { WelcomeFeature } from "@/components/onboarding/welcome-content";
import { WelcomeFeatureItem } from "@/components/onboarding/welcome-feature-item";

type WelcomeFeatureListProps = {
  features: readonly WelcomeFeature[];
};

export function WelcomeFeatureList({ features }: WelcomeFeatureListProps) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl bg-secondary/65 px-4 sm:px-5">
      {features.map((feature) => (
        <WelcomeFeatureItem key={feature.title} feature={feature} />
      ))}
    </ul>
  );
}
