type HomeStatCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
};

export function HomeStatCard({
  label,
  value,
  hint,
  icon: Icon,
  iconClassName,
}: HomeStatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div
          className={
            iconClassName ??
            "flex size-9 items-center justify-center rounded-xl bg-secondary text-primary"
          }
        >
          <Icon className="size-4" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
