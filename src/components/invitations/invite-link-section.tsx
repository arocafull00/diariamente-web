"use client";

import { Check, Copy, LoaderCircle, RefreshCw, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { buildInviteUrl, formatInviteCode } from "@/lib/invitations";
import { logger } from "@/lib/logger";
import { generateInviteLink } from "@/server/actions/invitations";

import { InviteQrCode } from "./invite-qr-code";

type InviteLinkSectionProps = {
  invite: { token: string; code: string } | null;
  origin: string;
};

export function InviteLinkSection({ invite, origin }: InviteLinkSectionProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const inviteUrl = invite ? buildInviteUrl(origin, invite.token) : null;

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateInviteLink();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(invite ? "¡Código nuevo listo!" : "¡Código listo!");
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
    if (!inviteUrl || !invite) {
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Conecta conmigo en Diariamente",
          text: `Mi código en Diariamente: ${formatInviteCode(invite.code)}`,
          url: inviteUrl,
        });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          logger.warn("invitations.share_failed", {
            errorName: error instanceof Error ? error.name : null,
          });
        }
      }
      return;
    }

    await handleCopy();
  }

  if (!invite || !inviteUrl) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-pretty text-muted-foreground">
          Crea tu QR y tu código para que tus pacientes se conecten al momento.
        </p>
        <Button
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
          {pending ? "Generando..." : "Crear QR y código"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="rounded-3xl bg-card p-4 shadow-xs ring-1 ring-border/60">
        <InviteQrCode value={inviteUrl} className="size-52" />
      </div>
      <p
        className="font-display text-4xl font-medium tracking-[0.18em] tabular-nums select-all"
        aria-label={`Código ${invite.code.split("").join(" ")}`}
      >
        {formatInviteCode(invite.code)}
      </p>
      <div className="flex w-full gap-2">
        <Button className="flex-1" disabled={pending} onClick={handleCopy}>
          {copied ? (
            <Check data-icon="inline-start" aria-hidden="true" />
          ) : (
            <Copy data-icon="inline-start" aria-hidden="true" />
          )}
          {copied ? "Copiado" : "Copiar enlace"}
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
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        disabled={pending}
        onClick={handleGenerate}
      >
        {pending ? (
          <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
        ) : (
          <RefreshCw data-icon="inline-start" aria-hidden="true" />
        )}
        {pending ? "Generando..." : "Crear uno nuevo"}
      </Button>
    </div>
  );
}
