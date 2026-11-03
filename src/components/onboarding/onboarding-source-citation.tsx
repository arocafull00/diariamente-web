import { ExternalLink } from "lucide-react";

import type { ScienceFinding } from "@/components/onboarding/onboarding-content";

type OnboardingSourceCitationProps = {
  finding: ScienceFinding;
};

export function OnboardingSourceCitation({ finding }: OnboardingSourceCitationProps) {
  return (
    <li className="px-4 py-3.5">
      <p className="text-[0.95rem] font-semibold">{finding.title}</p>
      <p className="mt-1 text-sm leading-5 text-foreground/70">{finding.description}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{finding.citation}</p>
      <a
        href={finding.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-mood-lu-strong underline-offset-4 hover:underline"
      >
        Leer el estudio
        <ExternalLink className="size-3.5" aria-hidden="true" />
      </a>
    </li>
  );
}
