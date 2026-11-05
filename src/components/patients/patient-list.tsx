"use client";

import { Search } from "lucide-react";
import type { ComponentProps } from "react";

import { StaggerItem } from "@/components/motion/stagger-item";
import { StaggerList } from "@/components/motion/stagger-list";
import { PatientCard } from "@/components/patients/patient-card";
import { PatientSortToggle } from "@/components/patients/patient-sort-toggle";
import { PatientsSearchEmpty } from "@/components/patients/patients-search-empty";
import { usePatientList } from "@/components/patients/use-patient-list";
import { Input } from "@/components/ui/input";

type PatientListProps = {
  patients: ComponentProps<typeof PatientCard>[];
};

export function PatientList({ patients }: PatientListProps) {
  const { query, setQuery, sortOrder, setSortOrder, visiblePatients } =
    usePatientList(patients);

  return (
    <div className="space-y-4 pb-20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Lucía Fernández"
            aria-label="Buscar paciente por nombre"
            className="rounded-full border-border bg-card pl-10 shadow-xs"
          />
        </div>
        <PatientSortToggle value={sortOrder} onChange={setSortOrder} />
      </div>
      <StaggerList className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
        {visiblePatients.length === 0 ? (
          <PatientsSearchEmpty />
        ) : (
          visiblePatients.map((patient) => (
            <StaggerItem key={patient.id}>
              <PatientCard {...patient} />
            </StaggerItem>
          ))
        )}
      </StaggerList>
    </div>
  );
}
