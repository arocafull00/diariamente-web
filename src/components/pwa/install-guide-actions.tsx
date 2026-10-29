"use client";

import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import type { InstallGuide } from "@/components/pwa/install-guide-content";
import { Button, buttonVariants } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { getOpenInChromeUrl } from "@/lib/install-platform";
import { logger } from "@/lib/logger";

type InstallGuideActionsProps = {
  action: InstallGuide["action"];
};

export function InstallGuideActions({ action }: InstallGuideActionsProps) {
  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(location.origin);
      toast.success("Enlace copiado");
    } catch (error) {
      logger.warn("pwa.copy_link_failed", {
        errorName: error instanceof Error ? error.name : null,
      });
      toast.error("No se pudo copiar el enlace");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {action === "open-chrome" && (
        <a href={getOpenInChromeUrl(location.href)} data-cuelume-tap="" className={buttonVariants()}>
          <ExternalLink data-icon="inline-start" />
          Abrir en Chrome
        </a>
      )}
      {action !== null && (
        <Button
          type="button"
          variant={action === "copy-link" ? "default" : "outline"}
          onClick={handleCopyLink}
        >
          <Copy data-icon="inline-start" />
          Copiar enlace
        </Button>
      )}
      {action === null && (
        <DialogClose render={<Button type="button" />}>Entendido</DialogClose>
      )}
    </div>
  );
}
