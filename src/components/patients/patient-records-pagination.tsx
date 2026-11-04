import { PatientRecordsPageLink } from "@/components/patients/patient-records-page-link";
import { getRecordFiltersHref, type RecordFilters } from "@/lib/record-filters";

type PatientRecordsPaginationProps = {
  pathname: string;
  filters: RecordFilters;
  pageCount: number;
};

export function PatientRecordsPagination({
  pathname,
  filters,
  pageCount,
}: PatientRecordsPaginationProps) {
  const { page } = filters;

  return (
    <nav
      aria-label="Páginas de registros"
      className="flex items-center justify-between gap-3"
    >
      <PatientRecordsPageLink
        direction="newer"
        href={
          page > 1
            ? getRecordFiltersHref(pathname, { ...filters, page: page - 1 })
            : null
        }
      />
      <p className="shrink-0 text-sm font-semibold text-muted-foreground tabular-nums">
        {page} de {pageCount}
      </p>
      <PatientRecordsPageLink
        direction="older"
        href={
          page < pageCount
            ? getRecordFiltersHref(pathname, { ...filters, page: page + 1 })
            : null
        }
      />
    </nav>
  );
}
