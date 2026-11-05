type PatientSessionSummaryBlockProps = {
  title: string;
  children: React.ReactNode;
};

export function PatientSessionSummaryBlock({
  title,
  children,
}: PatientSessionSummaryBlockProps) {
  return (
    <section className="space-y-2 rounded-3xl border border-border/60 bg-card p-4 shadow-xs">
      <h3 className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}
