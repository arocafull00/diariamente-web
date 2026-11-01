import type { LucideIcon } from "lucide-react";

type ClinicStatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
};

export function ClinicStatCard({ label, value, icon: Icon }: ClinicStatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-card p-4 shadow-sm ring-1 ring-border/60">
      <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-2xl leading-none font-bold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
