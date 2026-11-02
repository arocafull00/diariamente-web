import { Illustration } from "@/components/faces/illustration";

import { ProfileLeaveClinicButton } from "./profile-leave-clinic-button";
import { ProfileSectionCard } from "./profile-section-card";

type ProfileClinicCardProps = {
  name: string;
};

export function ProfileClinicCard({ name }: ProfileClinicCardProps) {
  return (
    <ProfileSectionCard title="Tu clínica">
      <div className="flex items-center gap-3">
        <Illustration name="equipo" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">
            Ve un resumen de tu actividad
          </p>
        </div>
        <ProfileLeaveClinicButton />
      </div>
    </ProfileSectionCard>
  );
}
