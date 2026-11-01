import type { LucideIcon } from "lucide-react";

type ClinicLoginFeatureProps = {
  icon: LucideIcon;
  text: string;
};

export function ClinicLoginFeature({ icon: Icon, text }: ClinicLoginFeatureProps) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 text-sm shadow-xs ring-1 ring-border/60">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="text-foreground">{text}</span>
    </li>
  );
}
