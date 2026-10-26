type PatientSessionSummaryBlockProps = {
  title: string;
  emptyLabel: string;
  isEmpty: boolean;
  children: React.ReactNode;
};

export function PatientSessionSummaryBlock({
  title,
  emptyLabel,
  isEmpty,
  children,
}: PatientSessionSummaryBlockProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {isEmpty ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        children
      )}
    </div>
  );
}
