"use client";

import { Eye, EyeOff, LoaderCircle, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  PRIVACY_POLICY_PATH,
  PSYCHOLOGIST_HIDDEN_DATA,
  PSYCHOLOGIST_VISIBLE_DATA,
} from "@/lib/privacy";
import { requestConnection } from "@/server/actions/invitations";

import { ConnectConsentDetails } from "./connect-consent-details";
import { ConnectHeroCard } from "./connect-hero-card";
import { ConnectPsychologistRow } from "./connect-psychologist-row";

type ConnectRequestCardProps = {
  psychologist: {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
};

export function ConnectRequestCard({ psychologist }: ConnectRequestCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [consent, setConsent] = useState(false);

  function handleRequest() {
    startTransition(async () => {
      const result = await requestConnection({ consent });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("¡Solicitud enviada!");
      router.replace("/perfil");
      router.refresh();
    });
  }

  return (
    <ConnectHeroCard
      faceIds={["alegria", "03_verde_morado"]}
      title={
        <>
          ¡Conecta con tu{" "}
          <span className="text-mood-lp-strong italic">psicólogo/a</span>!
        </>
      }
      description="En cuanto acepte tu solicitud, estaréis conectados."
    >
      <div className="divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs">
        <ConnectPsychologistRow
          psychologist={psychologist}
          label="Te invita"
          tone="green"
        />
        <ConnectConsentDetails
          icon={Eye}
          tone="blue"
          title="Qué podrá ver"
          description="Tus registros y lo que escribes en ellos."
          items={PSYCHOLOGIST_VISIBLE_DATA}
        />
        <ConnectConsentDetails
          icon={EyeOff}
          tone="yellow"
          title="Qué no podrá ver ni hacer"
          description="Tu correo, ni editar o borrar nada."
          items={PSYCHOLOGIST_HIDDEN_DATA}
        />
      </div>
      <label className="flex w-full cursor-pointer items-start gap-3 rounded-2xl bg-mood-lp-soft p-3 text-left text-sm leading-snug text-mood-foreground/80">
        <input
          type="checkbox"
          data-cuelume-toggle=""
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-mood-lp-3"
        />
        <span>
          Doy mi consentimiento explícito para compartir mis datos de salud con
          este profesional.
        </span>
      </label>
      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full"
          disabled={pending || !consent}
          onClick={handleRequest}
        >
          {pending ? (
            <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
          ) : (
            <UserPlus data-icon="inline-start" aria-hidden="true" />
          )}
          {pending ? "Enviando..." : "Solicitar conexión"}
        </Button>
        <p className="text-xs leading-5 text-pretty text-muted-foreground">
          Puedes retirar tu consentimiento cuando quieras desde tu perfil.{" "}
          <Link
            href={PRIVACY_POLICY_PATH}
            data-cuelume-tap="type"
            className="font-medium text-mood-lu-strong underline underline-offset-2"
          >
            Política de privacidad
          </Link>
        </p>
      </div>
    </ConnectHeroCard>
  );
}
