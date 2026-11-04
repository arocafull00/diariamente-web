import { PatientRecordFilters } from "@/components/patients/patient-record-filters";
import { PatientRecordsFilteredEmpty } from "@/components/patients/patient-records-filtered-empty";
import { PatientRecordsPagination } from "@/components/patients/patient-records-pagination";
import { RecordTimeline } from "@/components/records/record-timeline";
import type { GrammaticalGender, PatientRecord } from "@/db/schema";
import {
  hasActiveRecordFilters,
  type RecordEmotionOption,
  type RecordFilters,
} from "@/lib/record-filters";

type PatientRecordsSectionProps = {
  patientId: string;
  gender: GrammaticalGender;
  filters: RecordFilters;
  emotionOptions: RecordEmotionOption[];
  records: (PatientRecord & { hasNote: boolean })[];
  total: number;
  pageCount: number;
  lastSessionAt: Date | null;
};

export function PatientRecordsSection({
  patientId,
  gender,
  filters,
  emotionOptions,
  records,
  total,
  pageCount,
  lastSessionAt,
}: PatientRecordsSectionProps) {
  const recordLabel = total === 1 ? "registro" : "registros";
  const filteredLabel = hasActiveRecordFilters(filters)
    ? " con estos filtros"
    : "";

  return (
    <section id="registros" className="scroll-mt-28 space-y-4">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="font-display text-2xl leading-tight font-medium">
          Sus <span className="text-mood-lu-strong italic">registros</span>
        </h2>
        <p className="text-right text-xs text-muted-foreground">
          {total} {recordLabel}
          {filteredLabel}
        </p>
      </div>
      <PatientRecordFilters
        filters={filters}
        emotionOptions={emotionOptions}
        gender={gender}
      >
        {records.length === 0 ? (
          <PatientRecordsFilteredEmpty />
        ) : (
          <RecordTimeline
            records={records}
            gender={gender}
            showUnseen
            sessionAt={lastSessionAt}
          />
        )}
        {pageCount > 1 ? (
          <PatientRecordsPagination
            pathname={`/pacientes/${patientId}`}
            filters={filters}
            pageCount={pageCount}
          />
        ) : null}
      </PatientRecordFilters>
    </section>
  );
}
