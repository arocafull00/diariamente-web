import { InviteLinkSection } from "@/components/invitations/invite-link-section";

type WelcomeInviteStepProps = {
  token: string | null;
  origin: string;
};

export function WelcomeInviteStep({ token, origin }: WelcomeInviteStepProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-border/60 bg-card p-4 shadow-xs sm:p-5">
        <InviteLinkSection token={token} origin={origin} />
      </div>
      <p className="px-1 text-sm text-foreground/65">
        Encontrarás tu enlace y las solicitudes pendientes en la sección
        Pacientes.
      </p>
    </div>
  );
}
