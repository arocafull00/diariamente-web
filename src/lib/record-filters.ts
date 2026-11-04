import { format, isSameYear, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import type { RecordEmotion } from "@/db/schema";

export type RecordFilters = {
  emotions: string[];
  from?: string;
  to?: string;
  page: number;
};

export type RecordEmotionOption = {
  emotion: string;
  count: number;
};

export const RECORD_DATE_KEY_FORMAT = "yyyy-MM-dd";

export function hasActiveRecordFilters(filters: RecordFilters) {
  return filters.emotions.length > 0 || Boolean(filters.from || filters.to);
}

export function getRecordFiltersHref(pathname: string, filters: RecordFilters) {
  const params = new URLSearchParams();

  for (const emotion of filters.emotions) {
    params.append("emocion", emotion);
  }

  if (filters.from) {
    params.set("desde", filters.from);
  }

  if (filters.to) {
    params.set("hasta", filters.to);
  }

  if (filters.page > 1) {
    params.set("pagina", String(filters.page));
  }

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export function getRecordEmotionOptions(
  records: { emotions: RecordEmotion[] }[],
): RecordEmotionOption[] {
  const counts = new Map<string, number>();

  for (const record of records) {
    for (const emotion of new Set(record.emotions.map((item) => item.emotion))) {
      counts.set(emotion, (counts.get(emotion) ?? 0) + 1);
    }
  }

  return Array.from(counts, ([emotion, count]) => ({ emotion, count })).sort(
    (a, b) => b.count - a.count || a.emotion.localeCompare(b.emotion, "es"),
  );
}

function formatFilterDay(key: string, now: Date) {
  const date = parseISO(key);

  return format(date, isSameYear(date, now) ? "d MMM" : "d MMM yyyy", {
    locale: es,
  });
}

export function formatRecordFilterRange(from?: string, to?: string) {
  const now = new Date();

  if (from && to && from !== to) {
    return `${formatFilterDay(from, now)} – ${formatFilterDay(to, now)}`;
  }

  if (from && !to) {
    return `Desde ${formatFilterDay(from, now)}`;
  }

  if (to && !from) {
    return `Hasta ${formatFilterDay(to, now)}`;
  }

  return from ? formatFilterDay(from, now) : null;
}
