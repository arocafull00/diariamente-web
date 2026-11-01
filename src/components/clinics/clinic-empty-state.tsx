import { FaceRow } from "@/components/faces/face-row";

import { ClinicInviteSheet } from "./clinic-invite-sheet";

type ClinicEmptyStateProps = {
  token: string | null;
  origin: string;
};

export function ClinicEmptyState({ token, origin }: ClinicEmptyStateProps) {
  return (
    <div className="rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-border/60">
      <div className="mb-5">
        <FaceRow faceIds={["02_azul_rosa", "alegria", "05_rosa_verde"]} />
      </div>
      <p className="text-sm text-muted-foreground">
        Aún no hay psicólogos/as en tu clínica.
      </p>
      <div className="mt-4 flex justify-center">
        <ClinicInviteSheet token={token} origin={origin} variant="button" />
      </div>
    </div>
  );
}
