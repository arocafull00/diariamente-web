import {
  differenceInCalendarDays,
  format,
  isToday,
  isYesterday,
} from "date-fns";
import { es } from "date-fns/locale";

export function formatRecordDate(date: Date | string) {
  return format(new Date(date), "d MMM yyyy, HH:mm", { locale: es });
}

export function formatOccurrenceDate(date: Date) {
  return format(date, "d MMMM yyyy", { locale: es });
}

export function formatOccurrenceTime(date: Date) {
  return format(date, "HH:mm");
}

export function mergeOccurrenceDate(current: Date, selectedDay: Date) {
  const next = new Date(current);
  next.setFullYear(
    selectedDay.getFullYear(),
    selectedDay.getMonth(),
    selectedDay.getDate(),
  );
  return next;
}

export function mergeOccurrenceTime(current: Date, timeValue: string) {
  const [hours, minutes] = timeValue.split(":").map(Number);
  const next = new Date(current);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

export function isFutureDay(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = new Date(date);
  check.setHours(0, 0, 0, 0);
  return check > today;
}

export function getInitials(firstName?: string | null, lastName?: string | null) {
  const first = firstName?.charAt(0) ?? "";
  const last = lastName?.charAt(0) ?? "";
  const initials = `${first}${last}`.trim();

  if (initials) {
    return initials.toUpperCase();
  }

  return "?";
}

export function getFullName(
  firstName?: string | null,
  lastName?: string | null,
) {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (name) {
    return name;
  }

  return "Usuario";
}

export function formatMemberSince(date: Date | string) {
  return format(new Date(date), "MMMM 'de' yyyy", { locale: es });
}

export function formatLastActivityLabel(date: Date | string) {
  const value = new Date(date);

  if (isToday(value)) {
    return "hoy";
  }

  if (isYesterday(value)) {
    return "ayer";
  }

  const days = differenceInCalendarDays(new Date(), value);

  if (days < 7) {
    return `hace ${days} días`;
  }

  return format(value, "d MMM yyyy", { locale: es });
}

export function getRoleLabel(role: "patient" | "psychologist" | "admin") {
  if (role === "patient") {
    return "Paciente";
  }

  if (role === "psychologist") {
    return "Psicólogo/a";
  }

  return "Administrador";
}
