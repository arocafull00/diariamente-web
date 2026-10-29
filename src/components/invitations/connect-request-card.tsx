"use client";

import { Eye, EyeOff, LoaderCircle, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  PRIVACY_POLICY_PATH,
  PSYCHOLOGIST_HIDDEN_DATA,
  PSYCHOLOGIST_VISIBLE_DATA,
} from "@/lib/privacy";
import { getFullName, getInitials } from "@/lib/utils-app";
import { requestConnection } from "@/server/actions/invitations";

import { ConnectConsentList } from "./connect-consent-list";

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

      toast.success("Solicitud enviada");
      router.replace("/perfil");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-secondary p-6 text-center">
      <Avatar className="size-16">
        {psychologist.avatarUrl ? (
          <AvatarImage src={psychologist.avatarUrl} alt="" />
        ) : null}
        <AvatarFallback>
          {getInitials(psychologist.firstName, psychologist.lastName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          {getFullName(psychologist.firstName, psychologist.lastName)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Te invita a conectar en Diariamente. Al enviar la solicitud, tu
          psicólogo/a deberá aceptarla para vincularos.
        </p>
      </div>
      <div className="w-full space-y-4 rounded-2xl bg-card p-4 text-left">
        <ConnectConsentList
          title="Qué podrá ver"
          icon={Eye}
          items={PSYCHOLOGIST_VISIBLE_DATA}
        />
        <ConnectConsentList
          title="Qué no podrá ver ni hacer"
          icon={EyeOff}
          items={PSYCHOLOGIST_HIDDEN_DATA}
        />
        <p className="text-xs text-muted-foreground">
          Podrás ver cuándo consulta cada registro y retirar el consentimiento
          en cualquier momento desvinculándote desde tu perfil.{" "}
          <Link href={PRIVACY_POLICY_PATH} data-cuelume-tap="type" className="font-medium text-primary underline">
            Política de privacidad
          </Link>
        </p>
      </div>
      <label className="flex w-full items-start gap-3 text-left text-sm text-foreground">
        <input
          type="checkbox"
          data-cuelume-toggle=""
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
        <span>
          He leído qué información verá y doy mi consentimiento explícito para
          compartir mis datos de salud con este profesional.
        </span>
      </label>
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
    </div>
  );
}
