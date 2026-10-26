type DataExportSectionProps = {
  title: string;
  empty?: boolean;
  children: React.ReactNode;
};

export function DataExportSection({
  title,
  empty = false,
  children,
}: DataExportSectionProps) {
  return (
    <section className="space-y-3 break-inside-avoid-page">
      <h2 className="border-b border-border pb-1 font-display text-xl font-medium">
        {title}
      </h2>
      {empty ? (
        <p className="text-sm text-muted-foreground">Sin datos.</p>
      ) : (
        children
      )}
    </section>
  );
}
