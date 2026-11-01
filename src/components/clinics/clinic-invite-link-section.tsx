"use client";

import { Check, Copy, LoaderCircle, RefreshCw, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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

      toast.success(token ? "Enlace regenerado" : "Enlace generado");
      router.refresh();
    });
  }

  async function handleCopy() {
    if (!inviteUrl) {
      return;
    }

    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Enlace copiado");
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
        title: "Únete a nuestra clínica en Diariamente",
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
    <div className="space-y-4">
      <h3 className="font-medium">Enlace de invitación</h3>
      {inviteUrl ? (
        <>
          <div className="rounded-xl bg-secondary p-4">
            <p className="break-all text-sm font-medium text-primary">
              {inviteUrl}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
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
      ) : (
        <p className="text-sm text-muted-foreground">
          Genera un enlace para que tus psicólogos/as se unan a la clínica.
        </p>
      )}
      <Button
        variant={inviteUrl ? "ghost" : "default"}
        size="lg"
        className="w-full"
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
            ? "Regenerar enlace"
            : "Generar enlace"}
      </Button>
    </div>
  );
}
