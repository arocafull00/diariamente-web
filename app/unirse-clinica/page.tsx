import { cookies } from "next/headers";

import { ClinicJoinContent } from "@/components/clinics/clinic-join-content";
import { CLINIC_INVITE_COOKIE_NAME } from "@/lib/clinic-invitations";
import { requireProfile } from "@/server/auth/get-current-profile";

export default async function JoinClinicPage() {
  const profile = await requireProfile();
  const cookieStore = await cookies();
  const token = cookieStore.get(CLINIC_INVITE_COOKIE_NAME)?.value;

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-10">
      <ClinicJoinContent profileId={profile.id} role={profile.role} token={token} />
    </div>
  );
}
