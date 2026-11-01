import { Building2 } from "lucide-react";

import { ProfileLeaveClinicButton } from "./profile-leave-clinic-button";
import { ProfileSectionCard } from "./profile-section-card";

type ProfileClinicCardProps = {
  name: string;
};

export function ProfileClinicCard({ name }: ProfileClinicCardProps) {
  return (
    <ProfileSectionCard title="Tu clínica">
      <div className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
          <Building2 className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">
            Solo ve métricas agregadas
          </p>
        </div>
        <ProfileLeaveClinicButton />
      </div>
    </ProfileSectionCard>
  );
}
