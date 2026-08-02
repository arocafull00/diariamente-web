"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { AppHeader } from "@/components/app-shell/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Invitation } from "@/db/schema";
import {
  generateInvitation,
  revokeInvitation,
} from "@/server/actions/invitations";
import { formatRecordDate } from "@/lib/utils-app";

type InvitationPanelProps = {
  invitation: Invitation | null;
};

export function InvitationPanel({ invitation }: InvitationPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateInvitation();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Invitación generada");
      router.refresh();
    });
  }

  function handleRevoke() {
    if (!invitation) {
      return;
    }

    startTransition(async () => {
      const result = await revokeInvitation(invitation.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Invitación revocada");
      router.refresh();
    });
  }

  return (
    <>
      <AppHeader title="Invitar paciente" />
      <Card>
        <CardHeader>
          <CardTitle>Código de invitación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {invitation ? (
            <>
              <div className="rounded-lg bg-secondary p-4 text-center">
                <p className="text-3xl font-bold tracking-widest text-primary">
                  {invitation.code}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Caduca el {formatRecordDate(invitation.expiresAt)}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                disabled={pending}
                onClick={handleRevoke}
              >
                Revocar código
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Genera un código para que tu paciente se vincule contigo.
            </p>
          )}
          <Button className="w-full" disabled={pending} onClick={handleGenerate}>
            {pending
              ? "Generando..."
              : invitation
                ? "Regenerar código"
                : "Generar código"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
