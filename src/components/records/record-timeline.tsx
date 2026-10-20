import { RecordDayGroup } from "@/components/records/record-day-group";
import type { GrammaticalGender, PatientRecord } from "@/db/schema";
import { formatDayHeading, groupByDay } from "@/lib/dates";

type RecordTimelineProps = {
  records: (PatientRecord & { hasNote?: boolean })[];
  gender: GrammaticalGender;
  showUnseen: boolean;
};

export function RecordTimeline({
  records,
  gender,
  showUnseen,
}: RecordTimelineProps) {
  const now = new Date();

  return (
    <div className="space-y-6">
      {groupByDay(records).map((group) => (
        <RecordDayGroup
          key={group.key}
          heading={formatDayHeading(group.key, now)}
          records={group.items}
          gender={gender}
          showUnseen={showUnseen}
        />
      ))}
    </div>
  );
}
