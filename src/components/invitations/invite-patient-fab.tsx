"use client";

import { Plus } from "lucide-react";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";

function subscribe() {
  return () => {};
}

export function InvitePatientFab() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-40 lg:bottom-8 lg:left-64">
      <div className="mx-auto flex max-w-lg justify-end px-4 lg:max-w-7xl lg:px-8">
        <SheetTrigger
          render={<Button size="icon" className="pointer-events-auto size-14" />}
          aria-label="Añadir paciente"
        >
          <Plus className="size-6" strokeWidth={2.5} aria-hidden="true" />
        </SheetTrigger>
      </div>
    </div>,
    document.body,
  );
}
