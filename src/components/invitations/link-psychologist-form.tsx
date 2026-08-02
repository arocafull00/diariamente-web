"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redeemInvitation } from "@/server/actions/invitations";

const initialState = { error: undefined as string | undefined };

export function LinkPsychologistForm() {
  const [state, formAction, pending] = useActionState(
    redeemInvitation,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Vinculación completada");
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="code">Código de invitación</Label>
        <Input
          id="code"
          name="code"
          placeholder="Introduce el código"
          className="uppercase"
        />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Vinculando..." : "Vincular psicólogo"}
      </Button>
    </form>
  );
}
