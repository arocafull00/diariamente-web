import { useState } from "react";

import { getFullName } from "@/lib/utils-app";

export type PatientSortOrder = "recent" | "oldest";

type SortablePatient = {
  firstName: string | null;
  lastName: string | null;
  latestRecord: { occurredAt: Date } | null;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function usePatientList<T extends SortablePatient>(patients: T[]) {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<PatientSortOrder>("recent");

  const normalizedQuery = normalize(query);
  const direction = sortOrder === "recent" ? -1 : 1;

  const visiblePatients = patients
    .filter((patient) =>
      normalize(getFullName(patient.firstName, patient.lastName)).includes(
        normalizedQuery,
      ),
    )
    .toSorted((a, b) => {
      if (!a.latestRecord) return b.latestRecord ? 1 : 0;
      if (!b.latestRecord) return -1;
      return (
        direction *
        (a.latestRecord.occurredAt.getTime() -
          b.latestRecord.occurredAt.getTime())
      );
    });

  return { query, setQuery, sortOrder, setSortOrder, visiblePatients };
}
