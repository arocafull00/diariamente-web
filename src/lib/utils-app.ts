import { format } from "date-fns";
import { es } from "date-fns/locale";

export function formatRecordDate(date: Date | string) {
  return format(new Date(date), "d MMM yyyy, HH:mm", { locale: es });
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
