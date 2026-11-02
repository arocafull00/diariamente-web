import { FaceCluster } from "@/components/faces/face-cluster";

import { ClinicInviteSheet } from "./clinic-invite-sheet";

type ClinicEmptyStateProps = {
  token: string | null;
  origin: string;
};

export function ClinicEmptyState({ token, origin }: ClinicEmptyStateProps) {
  return (
    <section className="mx-auto max-w-2xl space-y-6 rounded-[2rem] bg-card/80 px-6 py-8 text-center shadow-sm ring-1 ring-border/50 backdrop-blur lg:px-10 lg:py-10">
      <FaceCluster className="max-w-64" />
      <div className="space-y-3">
        <h2 className="font-display text-3xl leading-tight font-medium text-balance sm:text-4xl">
          Tu equipo empieza{" "}
          <span className="text-mood-lp-strong italic">aquí</span>
        </h2>
        <p className="mx-auto max-w-md text-sm leading-6 text-pretty text-muted-foreground">
          Invita a los psicólogos/as de tu clínica con un enlace. Verás su
          actividad de forma agregada, nunca los datos de sus pacientes.
        </p>
      </div>
      <div className="flex justify-center">
        <ClinicInviteSheet token={token} origin={origin} variant="button" />
      </div>
    </section>
  );
}
