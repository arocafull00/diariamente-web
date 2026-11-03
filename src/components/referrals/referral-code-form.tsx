"use client";

import { Gift, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redeemReferralCode } from "@/server/actions/referrals";

type ReferralCodeFormProps = {
  defaultCode: string | undefined;
};

export function ReferralCodeForm({ defaultCode }: ReferralCodeFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(Boolean(defaultCode));
  const [code, setCode] = useState(defaultCode ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await redeemReferralCode(code);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success("¡Hecho! Tienes un mes extra de regalo");
      router.refresh();
    });
  }

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="mx-auto mt-3 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Gift data-icon="inline-start" aria-hidden="true" />
        ¿Te ha invitado un colega?
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-2 rounded-3xl border border-border/60 bg-card p-3 shadow-xs"
    >
      <label htmlFor="referral-code" className="flex items-center gap-2 px-1 text-sm font-semibold">
        <span className="flex size-7 items-center justify-center rounded-xl bg-mood-hp-soft text-mood-hp-strong">
          <Gift className="size-4" aria-hidden="true" />
        </span>
        Código de tu colega
      </label>
      <div className="flex gap-2">
        <Input
          id="referral-code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase());
            setError(null);
          }}
          maxLength={8}
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="ABCD2345"
          aria-invalid={error ? true : undefined}
          className="rounded-full font-semibold tracking-[0.2em] uppercase"
        />
        <Button type="submit" variant="outline" disabled={pending || code.trim().length === 0}>
          {pending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
          Aplicar
        </Button>
      </div>
      {error ? <p className="px-1 text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
