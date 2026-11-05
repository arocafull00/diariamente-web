"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";

import { FaceRow } from "@/components/faces/face-row";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ConnectionRequestsList } from "./connection-requests-list";
import { InvitePatientFab } from "./invite-patient-fab";
import { InviteLinkSection } from "./invite-link-section";
import { InviteStep } from "./invite-step";

const INVITE_STEPS = [
  {
    icon: "generar-enlace",
    title: "Crea tu enlace",
    description: "Es personal. Puedes cambiarlo cuando quieras.",
  },
  {
    icon: "compartir-equipo",
    title: "Compártelo con tu paciente",
    description: "Por WhatsApp, email o en consulta.",
  },
  {
    icon: "aceptar-invitacion",
    title: "Acepta su solicitud",
    description: "Aparecerá aquí y empezarás a ver sus registros.",
  },
] as const;

type ConnectionRequest = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

type InvitationsSheetProps = {
  token: string | null;
  origin: string;
  requests: ConnectionRequest[];
  variant?: "icon" | "button" | "floating";
};

export function InvitationsSheet({
  token,
  origin,
  requests,
  variant = "icon",
}: InvitationsSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {variant === "floating" ? (
        <InvitePatientFab />
      ) : variant === "button" ? (
        <SheetTrigger render={<Button />}>
          <UserPlus data-icon="inline-start" aria-hidden="true" />
          Invitar paciente
        </SheetTrigger>
      ) : (
        <SheetTrigger
          className="relative inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent active:scale-95"
          aria-label="Invitaciones"
        >
          <UserPlus className="size-5" aria-hidden="true" />
          {requests.length > 0 ? (
            <span className="absolute top-1.5 right-1.5 flex size-2 rounded-full bg-destructive" />
          ) : null}
        </SheetTrigger>
      )}
      <SheetContent
        side="right"
        className="flex flex-col gap-0 bg-background sm:max-w-md"
      >
        <SheetHeader className="px-5 pt-6 pb-4">
          <SheetTitle className="text-2xl font-bold tracking-tight">
            Invitaciones
          </SheetTitle>
          <SheetDescription>
            Comparte tu enlace y da la bienvenida a tus pacientes.
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6">
          <ConnectionRequestsList requests={requests} />
          <section className="space-y-5 rounded-[2rem] bg-card/80 px-5 py-6 text-center shadow-sm ring-1 ring-border/50 backdrop-blur">
            <FaceRow faceIds={["02_azul_rosa", "alegria", "05_rosa_verde"]} />
            <h3 className="font-display text-2xl leading-tight font-medium text-balance">
              Invita a tus{" "}
              <span className="text-mood-lp-strong italic">pacientes</span>
            </h3>
            <InviteLinkSection token={token} origin={origin} />
          </section>
          <section className="space-y-2">
            <h3 className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Cómo funciona
            </h3>
            <ol className="divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xs">
              {INVITE_STEPS.map((step) => (
                <InviteStep key={step.title} {...step} />
              ))}
            </ol>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
