import { StaggerItem } from "@/components/motion/stagger-item";
import { StaggerList } from "@/components/motion/stagger-list";
import { RecordCard } from "@/components/records/record-card";
import type { GrammaticalGender, PatientRecord } from "@/db/schema";

type RecordDayGroupProps = {
  heading: string;
  records: (PatientRecord & { hasNote?: boolean })[];
  gender: GrammaticalGender;
  showUnseen: boolean;
};

export function RecordDayGroup({
  heading,
  records,
  gender,
  showUnseen,
}: RecordDayGroupProps) {
  return (
    <section className="space-y-3">
      <h2 className="px-1 font-display text-lg font-medium first-letter:uppercase">
        {heading}
      </h2>
      <StaggerList className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {records.map((record) => (
          <StaggerItem key={record.id}>
            <RecordCard
              record={record}
              href={`/registro/${record.id}`}
              gender={gender}
              showUnseen={showUnseen}
              hasNote={record.hasNote ?? false}
              compactDate
            />
          </StaggerItem>
        ))}
      </StaggerList>
    </section>
  );
}
