import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFullName, getInitials } from "@/lib/utils-app";

import { ProfileCancelConnectionButton } from "./profile-cancel-connection-button";
import { ProfileSectionCard } from "./profile-section-card";

type PatientPendingRequest = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

type ProfileLinkPsychologistCardProps = {
  pendingRequest: PatientPendingRequest | null;
};

export function ProfileLinkPsychologistCard({
  pendingRequest,
}: ProfileLinkPsychologistCardProps) {
  if (pendingRequest) {
    return (
      <ProfileSectionCard title="Solicitud de conexión">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            {pendingRequest.avatarUrl ? (
              <AvatarImage src={pendingRequest.avatarUrl} alt="" />
            ) : null}
            <AvatarFallback>
              {getInitials(pendingRequest.firstName, pendingRequest.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">
              {getFullName(pendingRequest.firstName, pendingRequest.lastName)}
            </p>
            <p className="text-sm text-muted-foreground">
              Pendiente de aceptación
            </p>
          </div>
          <ProfileCancelConnectionButton requestId={pendingRequest.id} />
        </div>
      </ProfileSectionCard>
    );
  }

  return (
    <ProfileSectionCard title="Psicólogo/a asignado">
      <p className="text-sm text-muted-foreground">
        Pide a tu psicólogo/a que te comparta su enlace de invitación para
        vincularos.
      </p>
    </ProfileSectionCard>
  );
}
