import { CalendarArrowDown, CalendarArrowUp } from "lucide-react";

import { getRecordFilterTriggerClassName } from "@/components/patients/patient-record-filter-trigger-styles";
import type { PatientSortOrder } from "@/components/patients/use-patient-list";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = {
  recent: { label: "Más reciente", Icon: CalendarArrowDown, next: "oldest" },
  oldest: { label: "Más antiguo", Icon: CalendarArrowUp, next: "recent" },
} as const;

type PatientSortToggleProps = {
  value: PatientSortOrder;
  onChange: (value: PatientSortOrder) => void;
};

export function PatientSortToggle({ value, onChange }: PatientSortToggleProps) {
  const { label, Icon, next } = SORT_OPTIONS[value];

  return (
    <button
      type="button"
      aria-label={`Ordenar por último registro: ${label}`}
      onClick={() => onChange(next)}
      className={cn("shrink-0", getRecordFilterTriggerClassName(value === "oldest"))}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
