export type NavIconName = "home" | "book-open" | "user" | "users";

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
