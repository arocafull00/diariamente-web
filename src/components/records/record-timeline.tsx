import { RecordDayGroup } from "@/components/records/record-day-group";
import { RecordSessionDivider } from "@/components/records/record-session-divider";
import type { GrammaticalGender, PatientRecord } from "@/db/schema";
import { formatDayHeading, getDateKey, groupByDay } from "@/lib/dates";

type RecordTimelineProps = {
  records: (PatientRecord & { hasNote?: boolean })[];
  gender: GrammaticalGender;
  showUnseen: boolean;
  sessionAt?: Date | null;
};

export function RecordTimeline({
  records,
  gender,
  showUnseen,
  sessionAt = null,
}: RecordTimelineProps) {
  const now = new Date();
  const recentRecords = sessionAt
    ? records.filter((record) => record.occurredAt > sessionAt)
    : records;
  const olderRecords = sessionAt
    ? records.filter((record) => record.occurredAt <= sessionAt)
    : [];

  return (
    <div className="space-y-6">
      {groupByDay(recentRecords).map((group) => (
        <RecordDayGroup
          key={`recent-${group.key}`}
          heading={formatDayHeading(group.key, now)}
          records={group.items}
          gender={gender}
          showUnseen={showUnseen}
        />
      ))}
      {sessionAt && recentRecords.length > 0 && olderRecords.length > 0 ? (
        <RecordSessionDivider
          label={`Última sesión · ${formatDayHeading(getDateKey(sessionAt), now).toLowerCase()}`}
        />
      ) : null}
      {groupByDay(olderRecords).map((group) => (
        <RecordDayGroup
          key={`older-${group.key}`}
          heading={formatDayHeading(group.key, now)}
          records={group.items}
          gender={gender}
          showUnseen={showUnseen}
        />
      ))}
    </div>
  );
}
