type PatientSessionSummaryBlockProps = {
  title: string;
  children: React.ReactNode;
};

export function PatientSessionSummaryBlock({
  title,
  children,
}: PatientSessionSummaryBlockProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}
