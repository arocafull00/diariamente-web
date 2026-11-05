"use client";

import { useTransition } from "react";

import { useSignOut } from "@/hooks/use-sign-out";
import { cn } from "@/lib/utils";

type SignOutLinkProps = {
  className?: string;
  label?: string;
};

export function SignOutLink({ className, label = "Cerrar sesión" }: SignOutLinkProps) {
  const signOut = useSignOut();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await signOut().catch(() => window.location.assign("/empezar"));
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className={cn(
        "mx-auto text-sm font-medium text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:underline disabled:opacity-50",
        className,
      )}
    >
      {label}
    </button>
  );
}
