"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INVITE_CODE_LENGTH, normalizeInviteCode } from "@/lib/invitations";
import { openInviteCode } from "@/server/actions/invitations";

export function InviteCodeForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isComplete = normalizeInviteCode(code).length === INVITE_CODE_LENGTH;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await openInviteCode({ code });

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      router.push("/conectar");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="ABC 123"
          aria-label="Código de tu psicólogo/a"
          aria-invalid={error ? true : undefined}
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={INVITE_CODE_LENGTH + 2}
          className="h-12 flex-1 rounded-2xl text-center text-lg font-semibold tracking-[0.18em] tabular-nums"
        />
        <Button
          type="submit"
          size="icon-lg"
          className="size-12"
          disabled={pending || !isComplete}
          aria-label="Conectar"
        >
          {pending ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight aria-hidden="true" />
          )}
        </Button>
      </div>
      {error ? (
        <p className="px-1 text-sm text-destructive">{error}</p>
      ) : null}
    </form>
  );
}
