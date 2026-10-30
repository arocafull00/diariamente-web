import Image from "next/image";

import appIcon from "../../../app/icon.png";
import { FeedbackSidebarButton } from "@/components/feedback/feedback-sidebar-button";
import type { UserRole } from "@/db/schema";

import { DesktopSidebarNav } from "./desktop-sidebar-nav";
import { SidebarUserCard } from "./sidebar-user-card";

type DesktopSidebarProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: UserRole;
};

const ROLE_SUBTITLE: Record<UserRole, string> = {
  patient: "Área del paciente",
  psychologist: "Área profesional",
  admin: "Administración",
};

export function DesktopSidebar({
  firstName,
  lastName,
  avatarUrl,
  role,
}: DesktopSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-20 items-center gap-3 px-6">
        <Image
          src={appIcon}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-xl"
          priority
        />
        <div className="min-w-0">
          <p className="truncate font-semibold">Diariamente</p>
          <p className="truncate text-xs text-muted-foreground">
            {ROLE_SUBTITLE[role]}
          </p>
        </div>
      </div>

      <DesktopSidebarNav role={role} />

      <div className="px-3 pb-2">
        <FeedbackSidebarButton role={role} />
      </div>

      <div className="border-t border-border p-4">
        <SidebarUserCard
          firstName={firstName}
          lastName={lastName}
          avatarUrl={avatarUrl}
          role={role}
        />
      </div>
    </aside>
  );
}
