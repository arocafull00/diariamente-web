import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { WelcomeWizard } from "@/components/onboarding/welcome-wizard";
import { INVITE_COOKIE_NAME } from "@/lib/invitations";
import { requireProfile } from "@/server/auth/get-current-profile";
import { getInviteLink, getReminderSettings } from "@/server/queries";

export default async function WelcomePage() {
  const profile = await requireProfile();

  if (profile.role !== "patient" && profile.role !== "psychologist") {
    redirect("/");
  }

  const isPatient = profile.role === "patient";
  const [reminderSettings, inviteLink, cookieStore, headersList] =
    await Promise.all([
      isPatient ? getReminderSettings(profile.id) : null,
      isPatient ? null : getInviteLink(profile.id),
      cookies(),
      headers(),
    ]);

  const host = headersList.get("host") ?? "";
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  const origin = `${protocol}://${host}`;
  const hasInvite = Boolean(cookieStore.get(INVITE_COOKIE_NAME)?.value);
  const finishHref = isPatient
    ? hasInvite
      ? "/conectar"
      : "/inicio"
    : "/pacientes";

  return (
    <div className="relative flex min-h-svh flex-1 flex-col overflow-hidden">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 sm:py-8">
        <WelcomeWizard
          role={profile.role}
          finishHref={finishHref}
          remindersEnabled={reminderSettings?.enabled ?? false}
          inviteToken={inviteLink?.token ?? null}
          origin={origin}
        />
      </main>
    </div>
  );
}
