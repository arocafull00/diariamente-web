import { cn } from "@/lib/utils";

export function getRecordFilterTriggerClassName(active: boolean) {
  return cn(
    "inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
    active
      ? "bg-mood-lp-soft text-mood-lp-strong ring-2 ring-mood-lp-strong"
      : "bg-card text-foreground ring-1 ring-border hover:bg-secondary",
  );
}
