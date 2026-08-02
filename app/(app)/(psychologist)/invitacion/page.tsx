import { headers } from "next/headers";

import { AppHeader } from "@/components/app-shell/app-header";
import { ConnectionRequestsList } from "@/components/invitations/connection-requests-list";
import { InviteLinkCard } from "@/components/invitations/invite-link-card";
import { requireRole } from "@/server/auth/get-current-profile";
import { getInviteLink, getPendingConnectionRequests } from "@/server/queries";

export default async function InvitationPage() {
  const profile = await requireRole("psychologist");
  const [inviteLink, requests, headersList] = await Promise.all([
    getInviteLink(profile.id),
    getPendingConnectionRequests(profile.id),
    headers(),
  ]);

  const host = headersList.get("host") ?? "";
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  const origin = `${protocol}://${host}`;

  return (
    <>
      <AppHeader title="Invitar paciente" />
      <div className="space-y-4">
        <InviteLinkCard token={inviteLink?.token ?? null} origin={origin} />
        <ConnectionRequestsList requests={requests} />
      </div>
    </>
  );
}
