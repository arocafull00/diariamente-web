import type { ScienceFinding } from "@/components/onboarding/onboarding-content";
import { OnboardingScienceCard } from "@/components/onboarding/onboarding-science-card";
import { OnboardingSourcesSheet } from "@/components/onboarding/onboarding-sources-sheet";

type OnboardingScienceStepProps = {
  findings: readonly ScienceFinding[];
};

export function OnboardingScienceStep({ findings }: OnboardingScienceStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="divide-y divide-border/70 overflow-hidden rounded-3xl border-2 border-border bg-card">
        {findings.map((finding) => (
          <OnboardingScienceCard key={finding.id} finding={finding} />
        ))}
      </ul>
      <OnboardingSourcesSheet findings={findings} />
    </div>
  );
}
