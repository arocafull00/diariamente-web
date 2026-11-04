"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  getRecordFiltersHref,
  type RecordFilters,
} from "@/lib/record-filters";

export function usePatientRecordFilters(filters: RecordFilters) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const applyFilters = (next: Partial<Omit<RecordFilters, "page">>) => {
    startTransition(() => {
      router.replace(
        getRecordFiltersHref(pathname, { ...filters, ...next, page: 1 }),
        { scroll: false },
      );
    });
  };

  const clearFilters = () => {
    applyFilters({ emotions: [], from: undefined, to: undefined });
  };

  return { isPending, applyFilters, clearFilters };
}
