"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";
import { buildReferralUrl } from "@/lib/referrals";

type ReferralShareButtonsProps = {
  code: string;
};

export function ReferralShareButtons({ code }: ReferralShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  function getReferralUrl() {
    return buildReferralUrl(window.location.origin, code);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(getReferralUrl());
    setCopied(true);
    toast.success("¡Enlace copiado!");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({
        title: "Prueba DiariaMente con un mes extra gratis",
        text: `Usa mi código ${code} y tienes un mes más de prueba gratis en DiariaMente.`,
        url: getReferralUrl(),
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        logger.warn("referrals.share_failed", {
          errorName: error instanceof Error ? error.name : null,
        });
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button className="flex-1" onClick={handleCopy}>
        {copied ? (
          <Check data-icon="inline-start" aria-hidden="true" />
        ) : (
          <Copy data-icon="inline-start" aria-hidden="true" />
        )}
        {copied ? "Copiado" : "Copiar enlace"}
      </Button>
      <Button variant="outline" className="flex-1" onClick={handleShare}>
        <Share2 data-icon="inline-start" aria-hidden="true" />
        Compartir
      </Button>
    </div>
  );
}
