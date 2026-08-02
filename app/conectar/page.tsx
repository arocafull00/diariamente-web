import { cookies } from "next/headers";

import { ConnectPageContent } from "@/components/invitations/connect-page-content";
import { INVITE_COOKIE_NAME } from "@/lib/invitations";
import { requireProfile } from "@/server/auth/get-current-profile";

export default async function ConnectPage() {
  const profile = await requireProfile();
  const cookieStore = await cookies();
  const token = cookieStore.get(INVITE_COOKIE_NAME)?.value;

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-10">
      <ConnectPageContent profileId={profile.id} role={profile.role} token={token} />
    </div>
  );
}
