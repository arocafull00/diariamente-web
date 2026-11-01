"use client";

import { UserPlus } from "lucide-react";

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
          className="inline-flex size-10 items-center justify-center text-primary"
          aria-label="Invitar psicólogo/a"
        >
          <UserPlus className="size-5" aria-hidden="true" />
        </SheetTrigger>
      )}
      <SheetContent side="right" className="flex flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Invitar al equipo</SheetTitle>
          <SheetDescription>
            Comparte este enlace con los psicólogos/as de tu clínica. Cada uno
            deberá aceptar unirse.
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
          <ClinicInviteLinkSection token={token} origin={origin} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
