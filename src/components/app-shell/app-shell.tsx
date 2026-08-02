import type { Profile } from "@/db/schema";

import { AppHeader } from "./app-header";
import { PatientNavigation } from "./bottom-navigation";
import { PsychologistNavigation } from "./bottom-navigation";
import { DesktopSidebar } from "./desktop-sidebar";
import { NewRecordFab } from "./new-record-fab";

type AppShellProps = {
  profile: Profile;
  title?: string;
  showBack?: boolean;
  children: React.ReactNode;
};

export function AppShell({
  profile,
  title,
  showBack,
  children,
}: AppShellProps) {
  return (
    <div className="relative z-10 flex min-h-svh flex-1 flex-col lg:pl-64">
      <DesktopSidebar
        firstName={profile.firstName}
        lastName={profile.lastName}
        avatarUrl={profile.avatarUrl}
        role={profile.role!}
      />
      {title ? <AppHeader title={title} showBack={showBack} /> : null}
      <main className="flex w-full flex-1 flex-col pb-24 lg:pb-10 [&>*:not(header)]:mx-auto [&>*:not(header)]:flex [&>*:not(header)]:w-full [&>*:not(header)]:max-w-lg [&>*:not(header)]:flex-1 [&>*:not(header)]:flex-col [&>*:not(header)]:px-4 [&>*:not(header)]:pt-4 lg:[&>*:not(header)]:max-w-7xl lg:[&>*:not(header)]:px-8 lg:[&>*:not(header)]:pt-8">
        {children}
      </main>
      {profile.role === "patient" ? (
        <>
          <NewRecordFab />
          <PatientNavigation />
        </>
      ) : (
        <PsychologistNavigation />
      )}
    </div>
  );
}
