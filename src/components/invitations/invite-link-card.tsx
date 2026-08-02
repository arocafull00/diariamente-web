"use client";

import { Check, Copy, LoaderCircle, RefreshCw, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildInviteUrl } from "@/lib/invitations";
import { generateInviteLink } from "@/server/actions/invitations";

type InviteLinkCardProps = {
  token: string | null;
  origin: string;
};

export function InviteLinkCard({ token, origin }: InviteLinkCardProps) {
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

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Conecta conmigo en DiariaMente",
          url: inviteUrl,
        });
      } catch {
        return;
      }
      return;
    }

    await handleCopy();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enlace de invitación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {inviteUrl ? (
          <>
            <div className="rounded-lg bg-secondary p-4">
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
            Genera un enlace para que tu paciente se vincule contigo.
          </p>
        )}
        <Button
          variant={inviteUrl ? "ghost" : "default"}
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
      </CardContent>
    </Card>
  );
}
