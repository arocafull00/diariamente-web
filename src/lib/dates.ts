import { format } from "date-fns";
import { es } from "date-fns/locale";

export const APP_TIME_ZONE = "Europe/Madrid";

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const hourFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: APP_TIME_ZONE,
  hour: "2-digit",
  hourCycle: "h23",
});

export function getDateKey(date: Date | string) {
  return dateKeyFormatter.format(new Date(date));
}

function dateFromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function shiftKey(key: string, days: number) {
  const date = dateFromKey(key);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getDayPeriod(now: Date = new Date()) {
  const hour = Number(hourFormatter.format(now));

  if (hour >= 6 && hour < 14) {
    return "mañana";
  }

  if (hour >= 14 && hour < 21) {
    return "tarde";
  }

  return "noche";
}

export type WeekDay = {
  key: string;
  label: string;
  isToday: boolean;
  isFuture: boolean;
};

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

export function getCurrentWeek(now: Date = new Date()): WeekDay[] {
  const todayKey = getDateKey(now);
  const mondayOffset = (dateFromKey(todayKey).getUTCDay() + 6) % 7;
  const mondayKey = shiftKey(todayKey, -mondayOffset);

  return WEEKDAY_LABELS.map((label, index) => {
    const key = shiftKey(mondayKey, index);
    return { key, label, isToday: key === todayKey, isFuture: key > todayKey };
  });
}

export function getWeekStart(now: Date = new Date()) {
  const [monday] = getCurrentWeek(now);
  return dateFromKey(shiftKey(monday.key, -1));
}

export function getStreak(dates: (Date | string)[], now: Date = new Date()) {
  const keys = new Set(dates.map(getDateKey));
  const todayKey = getDateKey(now);
  let cursor = keys.has(todayKey) ? todayKey : shiftKey(todayKey, -1);
  let streak = 0;

  while (keys.has(cursor)) {
    streak += 1;
    cursor = shiftKey(cursor, -1);
  }

  return streak;
}

export function formatDayHeading(key: string, now: Date = new Date()) {
  const todayKey = getDateKey(now);

  if (key === todayKey) {
    return "Hoy";
  }

  if (key === shiftKey(todayKey, -1)) {
    return "Ayer";
  }

  return format(dateFromKey(key), "EEEE d 'de' MMMM", { locale: es });
}

export function groupByDay<T extends { occurredAt: Date }>(items: T[]) {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const key = getDateKey(item.occurredAt);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  return Array.from(groups, ([key, groupItems]) => ({ key, items: groupItems }));
}
