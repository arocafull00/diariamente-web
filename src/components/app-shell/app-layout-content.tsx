import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell/app-shell";
import { requireProfile } from "@/server/auth/get-current-profile";

type AppLayoutContentProps = {
  children: React.ReactNode;
};

export async function AppLayoutContent({ children }: AppLayoutContentProps) {
  const profile = await requireProfile();

  if (!profile.role) {
    redirect("/onboarding");
  }

  return <AppShell profile={profile}>{children}</AppShell>;
}
