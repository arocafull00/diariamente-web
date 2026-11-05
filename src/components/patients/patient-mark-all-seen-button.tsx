"use client";

import { CheckCheck, LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { markPatientRecordsAsSeen } from "@/server/actions/records";

type PatientMarkAllSeenButtonProps = {
  patientId: string;
};

export function PatientMarkAllSeenButton({
  patientId,
}: PatientMarkAllSeenButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await markPatientRecordsAsSeen(patientId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("¡Listo! Todo al día");
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={handleClick}
      className="text-mood-lp-strong"
    >
      {pending ? (
        <LoaderCircle
          className="animate-spin"
          data-icon="inline-start"
          aria-hidden="true"
        />
      ) : (
        <CheckCheck data-icon="inline-start" aria-hidden="true" />
      )}
      Marcar todo como leído
    </Button>
  );
}
