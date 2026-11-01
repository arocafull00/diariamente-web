"use client";

import type { UserRole } from "@/db/schema";

import { getNavItems } from "./nav-items";
import { SidebarNavItem } from "./sidebar-nav-item";

type DesktopSidebarNavProps = {
  role: UserRole;
};

export function DesktopSidebarNav({ role }: DesktopSidebarNavProps) {
  const items = getNavItems(role);

  return (
    <nav className="flex-1 space-y-1 px-3">
      {items.map((item) => (
        <SidebarNavItem key={item.href} {...item} />
      ))}
    </nav>
  );
}
