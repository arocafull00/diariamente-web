import type { UserRole } from "@/db/schema";

export type NavIconName = "home" | "book-open" | "user" | "users" | "building";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconName;
};

export const patientItems: NavItem[] = [
  { href: "/inicio", label: "Inicio", icon: "home" },
  { href: "/mis-registros", label: "Registros", icon: "book-open" },
  { href: "/perfil", label: "Perfil", icon: "user" },
];

export const psychologistItems: NavItem[] = [
  { href: "/pacientes", label: "Pacientes", icon: "users" },
  { href: "/perfil", label: "Perfil", icon: "user" },
];

export const clinicItems: NavItem[] = [
  { href: "/clinica", label: "Equipo", icon: "building" },
  { href: "/perfil", label: "Perfil", icon: "user" },
];

export function getNavItems(role: UserRole) {
  if (role === "patient") {
    return patientItems;
  }

  if (role === "clinic") {
    return clinicItems;
  }

  return psychologistItems;
}
