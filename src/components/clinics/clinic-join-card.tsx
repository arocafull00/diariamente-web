"use client";

import { Building2, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConnectConsentDetails } from "@/components/invitations/connect-consent-details";
import { ConnectHeroCard } from "@/components/invitations/connect-hero-card";
import { SettingsRowContent } from "@/components/profile/settings-row-content";
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

      toast.success(`¡Ya formas parte de ${clinicName}!`, {
        description: result.subscriptionCanceled
          ? "Tu suscripción individual se cancelará al final del periodo actual"
          : undefined,
      });
      router.replace("/perfil");
      router.refresh();
    });
  }

  return (
    <ConnectHeroCard
      faceIds={["02_azul_rosa", "alegria", "05_rosa_verde"]}
      title={
        <>
          ¡Únete a su{" "}
          <span className="text-mood-lp-strong italic">equipo</span>!
        </>
      }
      description="Tu clínica te invita a formar parte de su equipo en Diariamente."
    >
      <div className="divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs">
        <div className="flex items-center gap-3 px-4 py-3.5 text-left">
          <SettingsRowContent
            icon="equipo"
            tone="green"
            title={clinicName}
            trailing={
              <span className="shrink-0 rounded-full bg-mood-lp-soft px-2.5 py-0.5 text-xs font-bold text-mood-lp-strong">
                Te invita
              </span>
            }
          />
        </div>
        <ConnectConsentDetails
          icon={Eye}
          tone="blue"
          title="Qué podrá ver"
          description="Tu actividad: pacientes, registros y sesiones."
          items={CLINIC_VISIBLE_DATA}
        />
        <ConnectConsentDetails
          icon={EyeOff}
          tone="yellow"
          title="Qué no podrá ver ni hacer"
          description="Nunca verá los registros de tus pacientes."
          items={CLINIC_HIDDEN_DATA}
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
        <span>He leído qué verá la clínica y acepto compartirlo.</span>
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
    </ConnectHeroCard>
  );
}
