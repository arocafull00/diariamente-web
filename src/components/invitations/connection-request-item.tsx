"use client";

import { Check, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getFullName, getInitials } from "@/lib/utils-app";
import {
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "@/server/actions/invitations";

type ConnectionRequestItemProps = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

export function ConnectionRequestItem({
  id,
  firstName,
  lastName,
  avatarUrl,
}: ConnectionRequestItemProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleAccept() {
    startTransition(async () => {
      const result = await acceptConnectionRequest(id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Solicitud aceptada");
      router.refresh();
    });
  }

  function handleReject() {
    startTransition(async () => {
      const result = await rejectConnectionRequest(id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Solicitud rechazada");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
      <Avatar className="size-10">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
        <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
      </Avatar>
      <p className="min-w-0 flex-1 truncate font-medium">
        {getFullName(firstName, lastName)}
      </p>
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="outline"
          disabled={pending}
          onClick={handleReject}
          aria-label="Rechazar"
        >
          {pending ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <X aria-hidden="true" />
          )}
        </Button>
        <Button
          size="icon"
          disabled={pending}
          onClick={handleAccept}
          aria-label="Aceptar"
        >
          {pending ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <Check aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}
