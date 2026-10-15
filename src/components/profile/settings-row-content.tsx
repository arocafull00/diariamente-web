import { ChevronRight, LoaderCircle, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export const settingsRowClassName =
  "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:bg-muted/60 active:bg-muted disabled:pointer-events-none disabled:opacity-60";

const toneClassNames = {
  primary: "bg-accent text-primary",
  yellow: "bg-mood-hp-soft text-mood-hp-strong",
  blue: "bg-mood-lu-soft text-mood-lu-strong",
  green: "bg-mood-lp-soft text-mood-lp-strong",
  destructive: "bg-destructive/10 text-destructive",
} as const;

type SettingsRowContentProps = {
  icon: LucideIcon;
  tone: keyof typeof toneClassNames;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  loading?: boolean;
};

export function SettingsRowContent({
  icon: Icon,
  tone,
  title,
  description,
  trailing,
  loading = false,
}: SettingsRowContentProps) {
  return (
    <>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-2xl",
          toneClassNames[tone],
        )}
      >
        {loading ? (
          <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <Icon className="size-5" aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[0.95rem] font-semibold",
            tone === "destructive" && "text-destructive",
          )}
        >
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      {trailing ?? (
        <ChevronRight
          className="size-5 shrink-0 text-muted-foreground/60"
          aria-hidden="true"
        />
      )}
    </>
  );
}
