type DataExportListItemProps = {
  title: string;
  detail: string;
};

export function DataExportListItem({ title, detail }: DataExportListItemProps) {
  return (
    <li className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-2 text-sm">
      <span className="font-medium">{title}</span>
      <span className="text-muted-foreground">{detail}</span>
    </li>
  );
}
