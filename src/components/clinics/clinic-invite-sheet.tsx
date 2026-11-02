"use client";

import { UserPlus } from "lucide-react";

import { InviteStep } from "@/components/invitations/invite-step";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ClinicInviteLinkSection } from "./clinic-invite-link-section";

const INVITE_STEPS = [
  {
    icon: "generar-enlace",
    title: "Crea el enlace",
    description: "Uno para toda la clínica. Puedes cambiarlo cuando quieras.",
  },
  {
    icon: "compartir-equipo",
    title: "Compártelo con tu equipo",
    description: "Por WhatsApp, email o como prefieras.",
  },
  {
    icon: "aceptar-invitacion",
    title: "Cada psicólogo/a acepta unirse",
    description: "Su actividad aparecerá en tu panel junto a la del resto del equipo.",
  },
] as const;

type ClinicInviteSheetProps = {
  token: string | null;
  origin: string;
  variant?: "icon" | "button";
};

export function ClinicInviteSheet({
  token,
  origin,
  variant = "icon",
}: ClinicInviteSheetProps) {
  return (
    <Sheet>
      {variant === "button" ? (
        <SheetTrigger render={<Button />}>
          <UserPlus data-icon="inline-start" aria-hidden="true" />
          Invitar psicólogo/a
        </SheetTrigger>
      ) : (
        <SheetTrigger
          className="inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent active:scale-95"
          aria-label="Invitar psicólogo/a"
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
            Invitar al equipo
          </SheetTitle>
          <SheetDescription>
            Comparte un enlace y suma a tu equipo en un momento.
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6">
          <ClinicInviteLinkSection token={token} origin={origin} />
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
