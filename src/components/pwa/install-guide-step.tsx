import type { LucideIcon } from "lucide-react";

type InstallGuideStepProps = {
  number: number;
  icon: LucideIcon;
  text: string;
};

export function InstallGuideStep({ number, icon: Icon, text }: InstallGuideStepProps) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary">
        {number}
      </span>
      <span className="flex min-w-0 flex-1 items-start gap-2 pt-1 text-foreground">
        <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>{text}</span>
      </span>
    </li>
  );
}
