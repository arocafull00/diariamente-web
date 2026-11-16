
type RecordSessionDividerProps = {
  label: string;
};

export function RecordSessionDivider({ label }: RecordSessionDividerProps) {
  return (
    <div
      role="separator"
      aria-label={label}
      className="flex items-center gap-3"
    >
      <span className="h-px flex-1 bg-border" />
      <span className="inline-flex items-center rounded-full bg-mood-lp-soft px-3 py-1 text-xs font-semibold text-mood-lp-strong">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
