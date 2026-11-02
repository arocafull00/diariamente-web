"use client";

import { Building2, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConnectConsentList } from "@/components/invitations/connect-consent-list";
import { Button } from "@/components/ui/button";
import { CLINIC_HIDDEN_DATA, CLINIC_VISIBLE_DATA } from "@/lib/privacy";
import { joinClinic } from "@/server/actions/clinics";

type ClinicJoinCardProps = {
  clinicName: string;
};

export function ClinicJoinCard({ clinicName }: ClinicJoinCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [consent, setConsent] = useState(false);

  function handleJoin() {
    startTransition(async () => {
      const result = await joinClinic({ consent });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(`Te has unido a ${clinicName}`, {
        description: result.subscriptionCanceled
          ? "Tu suscripción individual se cancelará al final del periodo actual"
          : undefined,
      });
      router.replace("/perfil");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-secondary p-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-card text-primary">
        <Building2 className="size-8" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">{clinicName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Te invita a unirte a su equipo en Diariamente.
        </p>
      </div>
      <div className="w-full space-y-4 rounded-2xl bg-card p-4 text-left">
        <ConnectConsentList
          title="Qué podrá ver"
          icon={Eye}
          items={CLINIC_VISIBLE_DATA}
        />
        <ConnectConsentList
          title="Qué no podrá ver ni hacer"
          icon={EyeOff}
          items={CLINIC_HIDDEN_DATA}
        />
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
          He leído qué información verá la clínica y acepto compartir estas
          métricas agregadas.
        </span>
      </label>
      <Button
        size="lg"
        className="w-full"
        disabled={pending || !consent}
        onClick={handleJoin}
      >
        {pending ? (
          <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
        ) : (
          <Building2 data-icon="inline-start" aria-hidden="true" />
        )}
        {pending ? "Uniéndote..." : "Unirme a la clínica"}
      </Button>
    </div>
  );
}
