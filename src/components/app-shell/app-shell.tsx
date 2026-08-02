import type { Profile } from "@/db/schema";

import { AppHeader } from "./app-header";
import { PatientNavigation } from "./bottom-navigation";
import { PsychologistNavigation } from "./bottom-navigation";

type AppShellProps = {
  profile: Profile;
  title?: string;
  backHref?: string;
  children: React.ReactNode;
};

export function AppShell({
  profile,
  title,
  backHref,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      {title ? <AppHeader title={title} backHref={backHref} /> : null}
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-24 pt-4">
        {children}
      </main>
      {profile.role === "patient" ? (
        <PatientNavigation />
      ) : (
        <PsychologistNavigation />
      )}
    </div>
  );
}
