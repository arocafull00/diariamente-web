import { ConnectHeroCard } from "./connect-hero-card";
import { InviteCodeForm } from "./invite-code-form";

type ConnectCodeCardProps = {
  expired?: boolean;
};

export function ConnectCodeCard({ expired = false }: ConnectCodeCardProps) {
  return (
    <ConnectHeroCard
      faceIds={["alegria", "03_verde_morado"]}
      title={
        <>
          Conecta con tu{" "}
          <span className="text-mood-lp-strong italic">psicólogo/a</span>
        </>
      }
      description={
        expired
          ? "Ese enlace ya no funciona. Pídele su código nuevo y escríbelo aquí."
          : "Escribe el código que te ha dado."
      }
    >
      <InviteCodeForm />
    </ConnectHeroCard>
  );
}
