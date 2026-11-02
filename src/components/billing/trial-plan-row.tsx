type TrialPlanRowProps = {
  label: string;
  value: string;
};

export function TrialPlanRow({ label, value }: TrialPlanRowProps) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-end gap-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <div
        aria-hidden="true"
        className="mb-1 border-b border-dotted border-border"
      />
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}
