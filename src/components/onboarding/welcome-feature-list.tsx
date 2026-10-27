import type { WelcomeFeature } from "@/components/onboarding/welcome-content";
import { WelcomeFeatureItem } from "@/components/onboarding/welcome-feature-item";

type WelcomeFeatureListProps = {
  features: readonly WelcomeFeature[];
};

export function WelcomeFeatureList({ features }: WelcomeFeatureListProps) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-3xl border-2 border-border bg-card px-4 sm:px-5">
      {features.map((feature, index) => (
        <WelcomeFeatureItem key={feature.title} feature={feature} index={index} />
      ))}
    </ul>
  );
}
