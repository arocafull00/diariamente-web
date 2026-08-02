"use client";

import { LoaderCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getFullName, getInitials } from "@/lib/utils-app";
import { requestConnection } from "@/server/actions/invitations";

type ConnectRequestCardProps = {
  psychologist: {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
};

export function ConnectRequestCard({ psychologist }: ConnectRequestCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleRequest() {
    startTransition(async () => {
      const result = await requestConnection();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Solicitud enviada");
      router.replace("/perfil");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-secondary p-6 text-center">
      <Avatar className="size-16">
        {psychologist.avatarUrl ? (
          <AvatarImage src={psychologist.avatarUrl} alt="" />
        ) : null}
        <AvatarFallback>
          {getInitials(psychologist.firstName, psychologist.lastName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          {getFullName(psychologist.firstName, psychologist.lastName)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Te invita a conectar en DiariaMente. Al enviar la solicitud, tu
          psicólogo/a deberá aceptarla para vincularos.
        </p>
      </div>
      <Button className="w-full" disabled={pending} onClick={handleRequest}>
        {pending ? (
          <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
        ) : (
          <UserPlus data-icon="inline-start" aria-hidden="true" />
        )}
        {pending ? "Enviando..." : "Solicitar conexión"}
      </Button>
    </div>
  );
}
