import { Check } from "lucide-react";

type TrialPlanFeatureProps = {
  text: string;
};

export function TrialPlanFeature({ text }: TrialPlanFeatureProps) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <span>{text}</span>
    </li>
  );
}
