type DataExportFieldProps = {
  label: string;
  value: string;
};

export function DataExportField({ label, value }: DataExportFieldProps) {
  return (
    <div className="grid grid-cols-[10rem_minmax(0,1fr)] gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="whitespace-pre-wrap">{value || "—"}</dd>
    </div>
  );
}
