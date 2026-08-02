"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";

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
import { InviteLinkSection } from "./invite-link-section";

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
  variant?: "icon" | "button";
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
      {variant === "button" ? (
        <SheetTrigger render={<Button />}>
          <UserPlus data-icon="inline-start" aria-hidden="true" />
          Invitar paciente
        </SheetTrigger>
      ) : (
        <SheetTrigger
          className="relative inline-flex size-10 items-center justify-center text-primary"
          aria-label="Invitaciones"
        >
          <UserPlus className="size-5" aria-hidden="true" />
          {requests.length > 0 ? (
            <span className="absolute top-1.5 right-1.5 flex size-2 rounded-full bg-destructive" />
          ) : null}
        </SheetTrigger>
      )}
      <SheetContent side="right" className="flex flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Invitaciones</SheetTitle>
          <SheetDescription>
            Comparte tu enlace y gestiona las solicitudes de conexión.
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
          <InviteLinkSection token={token} origin={origin} />
          <ConnectionRequestsList requests={requests} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
