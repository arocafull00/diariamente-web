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

import { InvitePatientFab } from "./invite-patient-fab";
import { InviteLinkSection } from "./invite-link-section";
import { InviteStep } from "./invite-step";

const INVITE_STEPS = [
  {
    icon: "generar-enlace",
    title: "Enséñale tu QR",
    description: "En consulta lo escanea con la cámara del móvil.",
  },
  {
    icon: "compartir-equipo",
    title: "O dile tu código",
    description: "Lo escribe en su perfil, ideal en videollamada.",
  },
  {
    icon: "aceptar-invitacion",
    title: "Conectados al momento",
    description: "Sin solicitudes: verás sus registros enseguida.",
  },
] as const;

type InvitationsSheetProps = {
  invite: { token: string; code: string } | null;
  origin: string;
  variant?: "icon" | "button" | "floating";
};

export function InvitationsSheet({
  invite,
  origin,
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
          className="inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent active:scale-95"
          aria-label="Invitaciones"
        >
          <UserPlus className="size-5" aria-hidden="true" />
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
            Tus pacientes se conectan contigo al instante.
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6">
          <section className="space-y-5 rounded-[2rem] bg-card/80 px-5 py-6 text-center shadow-sm ring-1 ring-border/50 backdrop-blur">
            <FaceRow faceIds={["02_azul_rosa", "alegria", "05_rosa_verde"]} />
            <h3 className="font-display text-2xl leading-tight font-medium text-balance">
              Invita a tus{" "}
              <span className="text-mood-lp-strong italic">pacientes</span>
            </h3>
            <InviteLinkSection invite={invite} origin={origin} />
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
