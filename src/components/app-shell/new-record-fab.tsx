"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

const FAB_ROUTES = new Set(["/inicio", "/mis-registros"]);

export function NewRecordFab() {
  const pathname = usePathname();

  if (!FAB_ROUTES.has(pathname)) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg justify-end px-4">
        <Link
          href="/nuevo-registro"
          className={cn(
            "pointer-events-auto flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg transition-transform hover:bg-primary/90 active:scale-95",
          )}
        >
          <Plus className="size-5 shrink-0" strokeWidth={2.5} />
          <span>Nuevo registro</span>
        </Link>
      </div>
    </div>
  );
}
