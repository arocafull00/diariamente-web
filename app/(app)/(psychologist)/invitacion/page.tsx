import { InvitationPanel } from "@/components/invitations/invitation-panel";
import { requireRole } from "@/server/auth/get-current-profile";
import { getActiveInvitation } from "@/server/queries";

export default async function InvitationPage() {
  const profile = await requireRole("psychologist");
  const invitation = await getActiveInvitation(profile.id);

  return <InvitationPanel invitation={invitation} />;
}
