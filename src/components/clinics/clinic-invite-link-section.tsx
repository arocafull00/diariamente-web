"use client";

import { Check, Copy, LoaderCircle, RefreshCw, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { FaceRow } from "@/components/faces/face-row";
import { Illustration } from "@/components/faces/illustration";
import { Button } from "@/components/ui/button";
import { buildClinicInviteUrl } from "@/lib/clinic-invitations";
import { logger } from "@/lib/logger";
import { generateClinicInviteLink } from "@/server/actions/clinics";

type ClinicInviteLinkSectionProps = {
  token: string | null;
  origin: string;
};

export function ClinicInviteLinkSection({
  token,
  origin,
}: ClinicInviteLinkSectionProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const inviteUrl = token ? buildClinicInviteUrl(origin, token) : null;

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateClinicInviteLink();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(token ? "¡Enlace nuevo listo!" : "¡Enlace listo!");
      router.refresh();
    });
  }

  async function handleCopy() {
    if (!inviteUrl) {
      return;
    }

    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("¡Enlace copiado!");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (!inviteUrl) {
      return;
    }

    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({
        title: "¡Únete a nuestro equipo en Diariamente!",
        url: inviteUrl,
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        logger.warn("clinics.share_failed", {
          errorName: error instanceof Error ? error.name : null,
        });
      }
    }
  }

  return (
    <section className="space-y-5 rounded-[2rem] bg-card/80 px-5 py-6 text-center shadow-sm ring-1 ring-border/50 backdrop-blur">
      <FaceRow faceIds={["03_verde_morado", "alegria", "05_rosa_verde"]} />
      <div className="space-y-2">
        <h3 className="font-display text-2xl leading-tight font-medium text-balance">
          Suma a tu{" "}
          <span className="text-mood-lp-strong italic">equipo</span>
        </h3>
        {inviteUrl ? null : (
          <p className="mx-auto max-w-xs text-sm leading-6 text-pretty text-muted-foreground">
            Crea un enlace y compártelo con tus psicólogos/as para que se unan.
          </p>
        )}
      </div>
      {inviteUrl ? (
        <>
          <div className="flex items-center gap-3 rounded-2xl bg-mood-lp-soft p-3 text-left">
            <Illustration name="generar-enlace" className="size-10" />
            <p className="min-w-0 flex-1 text-sm font-semibold break-all text-mood-lp-strong">
              {inviteUrl}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="btn-raised-joy flex-1 text-mood-foreground"
              disabled={pending}
              onClick={handleCopy}
            >
              {copied ? (
                <Check data-icon="inline-start" aria-hidden="true" />
              ) : (
                <Copy data-icon="inline-start" aria-hidden="true" />
              )}
              {copied ? "Copiado" : "Copiar"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={pending}
              onClick={handleShare}
            >
              <Share2 data-icon="inline-start" aria-hidden="true" />
              Compartir
            </Button>
          </div>
        </>
      ) : null}
      <Button
        variant={inviteUrl ? "ghost" : "default"}
        size={inviteUrl ? "sm" : "lg"}
        className={
          inviteUrl
            ? "mx-auto text-muted-foreground"
            : "btn-raised-joy w-full text-mood-foreground"
        }
        disabled={pending}
        onClick={handleGenerate}
      >
        {pending ? (
          <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
        ) : (
          <RefreshCw data-icon="inline-start" aria-hidden="true" />
        )}
        {pending
          ? "Generando..."
          : inviteUrl
            ? "Crear uno nuevo"
            : "Crear enlace"}
      </Button>
    </section>
  );
}
