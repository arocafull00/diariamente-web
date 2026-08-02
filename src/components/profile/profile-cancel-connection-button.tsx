"use client";

import { LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cancelConnectionRequest } from "@/server/actions/invitations";

type ProfileCancelConnectionButtonProps = {
  requestId: string;
};

export function ProfileCancelConnectionButton({
  requestId,
}: ProfileCancelConnectionButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelConnectionRequest(requestId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Solicitud cancelada");
      router.refresh();
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={handleCancel}
    >
      {pending ? (
        <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
      ) : (
        <X data-icon="inline-start" aria-hidden="true" />
      )}
      Cancelar
    </Button>
  );
}
