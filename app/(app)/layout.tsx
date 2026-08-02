import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell/app-shell";
import { requireProfile } from "@/server/auth/get-current-profile";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  if (!profile.role) {
    redirect("/onboarding");
  }

  return <AppShell profile={profile}>{children}</AppShell>;
}
