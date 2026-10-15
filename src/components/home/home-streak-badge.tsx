import { Zap } from "lucide-react";

import { cn } from "@/lib/utils";

type HomeStreakBadgeProps = {
  streak: number;
};

export function HomeStreakBadge({ streak }: HomeStreakBadgeProps) {
  const label =
    streak === 0
      ? "Empieza tu racha hoy"
      : `${streak} ${streak === 1 ? "día" : "días"} de racha`;

  return (
    <p
      className={cn(
        "mx-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase",
        streak > 0
          ? "bg-mood-hp-soft text-mood-hp-strong"
          : "bg-foreground/5 text-muted-foreground",
      )}
    >
      <Zap
        className={cn("size-3.5", streak > 0 && "fill-current")}
        aria-hidden="true"
      />
      {label}
    </p>
  );
}
