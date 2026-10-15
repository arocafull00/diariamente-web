type SettingsGroupProps = {
  title: string;
  children: React.ReactNode;
};

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  return (
    <section className="space-y-2 [&:not(:has([data-slot=settings-row]))]:hidden">
      <h3 className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs">
        {children}
      </div>
    </section>
  );
}
