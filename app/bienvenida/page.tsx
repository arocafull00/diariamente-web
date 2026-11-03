import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { WelcomeWizard } from "@/components/onboarding/welcome-wizard";
import { CLINIC_INVITE_COOKIE_NAME } from "@/lib/clinic-invitations";
import { INVITE_COOKIE_NAME } from "@/lib/invitations";
import { requireProfile } from "@/server/auth/get-current-profile";
import { getPatientPsychologist, getTherapyStatus } from "@/server/queries";

export default async function WelcomePage() {
  const profile = await requireProfile();

  if (profile.role !== "patient" && profile.role !== "psychologist") {
    redirect("/");
  }

  const isPatient = profile.role === "patient";
  const [therapyStatus, psychologist, cookieStore] = await Promise.all([
    isPatient ? getTherapyStatus(profile.id) : null,
    isPatient ? getPatientPsychologist(profile.id) : null,
    cookies(),
  ]);

  const hasInvite = Boolean(cookieStore.get(INVITE_COOKIE_NAME)?.value);
  const hasClinicInvite = Boolean(
    cookieStore.get(CLINIC_INVITE_COOKIE_NAME)?.value,
  );
  const showConnect =
    therapyStatus === "in_therapy" && !psychologist && !hasInvite;
  const finishHref = isPatient
    ? hasInvite
      ? "/conectar"
      : "/inicio"
    : hasClinicInvite
      ? "/unirse-clinica"
      : "/pacientes";

  return (
    <div className="relative flex min-h-svh flex-1 flex-col overflow-x-clip">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 sm:pt-8">
        <WelcomeWizard
          role={profile.role}
          firstName={profile.firstName ?? ""}
          finishHref={finishHref}
          showConnect={showConnect}
        />
      </main>
    </div>
  );
}
