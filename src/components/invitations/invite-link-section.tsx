"use client";

import { Check, Copy, LoaderCircle, RefreshCw, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Illustration } from "@/components/faces/illustration";
import { Button } from "@/components/ui/button";
import { buildInviteUrl } from "@/lib/invitations";
import { logger } from "@/lib/logger";
import { generateInviteLink } from "@/server/actions/invitations";

type InviteLinkSectionProps = {
  token: string | null;
  origin: string;
};

export function InviteLinkSection({ token, origin }: InviteLinkSectionProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const inviteUrl = token ? buildInviteUrl(origin, token) : null;

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateInviteLink();

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

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Conecta conmigo en Diariamente",
          url: inviteUrl,
        });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          logger.warn("invitations.share_failed", {
            errorName: error instanceof Error ? error.name : null,
          });
        }
        return;
      }
      return;
    }

    await handleCopy();
  }

  return (
    <div className="space-y-4">
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
      ) : (
        <p className="text-sm leading-6 text-pretty text-muted-foreground">
          Crea un enlace y compártelo con tu paciente para empezar a acompañarle.
        </p>
      )}
      <div className="flex justify-center">
        <Button
          variant={inviteUrl ? "ghost" : "default"}
          size={inviteUrl ? "sm" : "lg"}
          className={
            inviteUrl
              ? "text-muted-foreground"
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
      </div>
    </div>
  );
}
