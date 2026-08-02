"use client";

import { BookOpen, Home, User, Users } from "lucide-react";

import type { NavIconName } from "./nav-items";

const ICONS: Record<
  NavIconName,
  React.ComponentType<{ className?: string }>
> = {
  home: Home,
  "book-open": BookOpen,
  user: User,
  users: Users,
};

type NavIconProps = {
  name: NavIconName;
  className?: string;
};

export function NavIcon({ name, className }: NavIconProps) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden={true} />;
}
