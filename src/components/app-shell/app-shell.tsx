import { PageTransition } from "@/components/motion/page-transition";
import type { Profile } from "@/db/schema";

import { AppHeader } from "./app-header";
import { PatientNavigation } from "./bottom-navigation";
import { PsychologistNavigation } from "./bottom-navigation";
import { DesktopSidebar } from "./desktop-sidebar";
import { NewRecordFab } from "./new-record-fab";

type AppShellProps = {
  profile: Pick<Profile, "firstName" | "lastName" | "avatarUrl" | "role">;
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
      <main className="flex w-full flex-1 flex-col pb-28 lg:pb-10 [&>div>*:not(header)]:mx-auto [&>div>*:not(header)]:flex [&>div>*:not(header)]:w-full [&>div>*:not(header)]:max-w-lg [&>div>*:not(header)]:flex-1 [&>div>*:not(header)]:flex-col [&>div>*:not(header)]:px-4 [&>div>*:not(header)]:pt-4 lg:[&>div>*:not(header)]:max-w-7xl lg:[&>div>*:not(header)]:px-8 lg:[&>div>*:not(header)]:pt-8">
        <PageTransition>{children}</PageTransition>
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
