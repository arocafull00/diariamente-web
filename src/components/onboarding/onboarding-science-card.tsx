import { Illustration } from "@/components/faces/illustration";
import type { ScienceFinding } from "@/components/onboarding/onboarding-content";
import { WELCOME_TONE_CLASSES } from "@/components/onboarding/welcome-tones";
import { cn } from "@/lib/utils";

type OnboardingScienceCardProps = {
  finding: ScienceFinding;
};

export function OnboardingScienceCard({ finding }: OnboardingScienceCardProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <Illustration name={finding.icon} className="size-12 shrink-0" />
      <div className="min-w-0">
        <p className="leading-5 font-bold">{finding.title}</p>
        <span
          className={cn(
            "mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold",
            WELCOME_TONE_CLASSES[finding.tone].chip,
          )}
        >
          {finding.source}
        </span>
      </div>
    </li>
  );
}
