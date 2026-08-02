import { RecordCard } from "@/components/records/record-card";
import type { PatientRecord } from "@/db/schema";
import { cn } from "@/lib/utils";

type HomeRecentRecordItemProps = {
  record: PatientRecord;
  desktopOnly: boolean;
};

export function HomeRecentRecordItem({
  record,
  desktopOnly,
}: HomeRecentRecordItemProps) {
  return (
    <div className={cn(desktopOnly && "hidden lg:block")}>
      <RecordCard record={record} href={`/registro/${record.id}`} />
    </div>
  );
}
