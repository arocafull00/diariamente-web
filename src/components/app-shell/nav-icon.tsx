"use client";

import { Illustration } from "@/components/faces/illustration";
import type { IllustrationName } from "@/lib/illustrations";

import type { NavIconName } from "./nav-items";

const ICONS: Record<NavIconName, IllustrationName> = {
  home: "inicio",
  "book-open": "registros",
  user: "perfil",
  users: "equipo",
  building: "equipo",
};

type NavIconProps = {
  name: NavIconName;
  className?: string;
};

export function NavIcon({ name, className }: NavIconProps) {
  return <Illustration name={ICONS[name]} className={className} />;
}
