import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getFullName } from "@/lib/utils-app";
import { cn } from "@/lib/utils";

import { ConnectHeroCard } from "./connect-hero-card";
import { ConnectPsychologistRow } from "./connect-psychologist-row";
import { ConnectSwitchPsychologistDialog } from "./connect-switch-psychologist-dialog";

type Psychologist = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

type ConnectExistingPsychologistProps = {
  currentPsychologist: Psychologist;
  invitingPsychologist: Psychologist;
  isSamePsychologist: boolean;
};

const rowGroupClassName =
  "divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs";

export function ConnectExistingPsychologist({
  currentPsychologist,
  invitingPsychologist,
  isSamePsychologist,
}: ConnectExistingPsychologistProps) {
  const currentName = getFullName(
    currentPsychologist.firstName,
    currentPsychologist.lastName,
  );

  if (isSamePsychologist) {
    return (
      <ConnectHeroCard
        faceIds={["alegria", "05_rosa_verde"]}
        title={
          <>
            ¡Ya estáis{" "}
            <span className="text-mood-lp-strong italic">conectados</span>!
          </>
        }
        description={`${currentName} ya puede acompañarte con tus registros. No tienes que hacer nada más.`}
      >
        <div className={rowGroupClassName}>
          <ConnectPsychologistRow
            psychologist={currentPsychologist}
            label="Tu psicólogo/a"
            tone="green"
          />
        </div>
        <Link
          href="/"
          data-cuelume-tap=""
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          Ir al inicio
        </Link>
      </ConnectHeroCard>
    );
  }

  const newName = getFullName(
    invitingPsychologist.firstName,
    invitingPsychologist.lastName,
  );

  return (
    <ConnectHeroCard
      faceIds={["02_azul_rosa", "04_naranja_amarillo"]}
      title={
        <>
          ¡Ya tienes{" "}
          <span className="text-mood-lu-strong italic">psicólogo/a</span>!
        </>
      }
      description="Solo puedes conectar con un profesional a la vez."
    >
      <div className={rowGroupClassName}>
        <ConnectPsychologistRow
          psychologist={currentPsychologist}
          label="Ahora"
          tone="blue"
        />
        <ConnectPsychologistRow
          psychologist={invitingPsychologist}
          label="Te invita"
          tone="green"
        />
      </div>
      <div className="flex flex-col gap-2">
        <ConnectSwitchPsychologistDialog
          currentName={currentName}
          newName={newName}
        />
        <Link
          href="/"
          data-cuelume-tap=""
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
        >
          Seguir con {currentName}
        </Link>
      </div>
    </ConnectHeroCard>
  );
}
