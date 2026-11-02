import type { LucideIcon } from "lucide-react";

import { Illustration } from "@/components/faces/illustration";
import type { IllustrationName } from "@/lib/illustrations";
import { cn } from "@/lib/utils";

type SubscriptionPlanRowProps = {
  icon: LucideIcon | IllustrationName;
  iconClassName: string;
  label: string;
  value: string;
};

export function SubscriptionPlanRow({
  icon: Icon,
  iconClassName,
  label,
  value,
}: SubscriptionPlanRowProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span
        aria-hidden="true"
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-xl",
          typeof Icon !== "string" && iconClassName,
        )}
      >
        {typeof Icon === "string" ? (
          <Illustration name={Icon} className="size-8" />
        ) : (
          <Icon className="size-4" strokeWidth={2.5} />
        )}
      </span>
      <dt className="flex-1 text-sm text-foreground/65">{label}</dt>
      <dd className="text-right text-sm font-bold">{value}</dd>
    </div>
  );
}
