"use client";

import { Loader2, X } from "lucide-react";
import type { ReactNode } from "react";

import { PatientRecordDateFilter } from "@/components/patients/patient-record-date-filter";
import { PatientRecordEmotionFilter } from "@/components/patients/patient-record-emotion-filter";
import { usePatientRecordFilters } from "@/components/patients/use-patient-record-filters";
import { Button } from "@/components/ui/button";
import type { GrammaticalGender } from "@/db/schema";
import {
  hasActiveRecordFilters,
  type RecordEmotionOption,
  type RecordFilters,
} from "@/lib/record-filters";
import { cn } from "@/lib/utils";

type PatientRecordFiltersProps = {
  filters: RecordFilters;
  emotionOptions: RecordEmotionOption[];
  gender: GrammaticalGender;
  children: ReactNode;
};

export function PatientRecordFilters({
  filters,
  emotionOptions,
  gender,
  children,
}: PatientRecordFiltersProps) {
  const { isPending, applyFilters, clearFilters } =
    usePatientRecordFilters(filters);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <PatientRecordEmotionFilter
          options={emotionOptions}
          selected={filters.emotions}
          gender={gender}
          onApply={(emotions) => applyFilters({ emotions })}
        />
        <PatientRecordDateFilter
          from={filters.from}
          to={filters.to}
          onApply={applyFilters}
        />
        {hasActiveRecordFilters(filters) ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={clearFilters}
          >
            <X data-icon="inline-start" aria-hidden="true" />
            Quitar filtros
          </Button>
        ) : null}
        {isPending ? (
          <Loader2
            className="size-4 animate-spin text-muted-foreground"
            aria-label="Cargando registros"
          />
        ) : null}
      </div>
      <div
        aria-busy={isPending}
        className={cn(
          "space-y-6 transition-opacity duration-200",
          isPending && "pointer-events-none opacity-50",
        )}
      >
        {children}
      </div>
    </>
  );
}
