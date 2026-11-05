"use client";

import { useClerk } from "@clerk/nextjs";
import { useCallback } from "react";

import { signOutAndLeave } from "@/lib/sign-out";

export function useSignOut() {
  const clerk = useClerk();

  return useCallback(
    () => signOutAndLeave(clerk.session ? () => clerk.signOut() : null),
    [clerk],
  );
}
