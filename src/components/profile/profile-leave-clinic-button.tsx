"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { leaveClinic } from "@/server/actions/clinics";

export function ProfileLeaveClinicButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleLeave() {
    startTransition(async () => {
      const result = await leaveClinic();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Has salido de la clínica");
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          "shrink-0",
        )}
      >
        Salir
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Salir de la clínica?</AlertDialogTitle>
          <AlertDialogDescription>
            La clínica dejará de ver tu actividad. Tus pacientes seguirán
            vinculados contigo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={handleLeave}
          >
            {pending ? (
              <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" />
            ) : (
              <LogOut data-icon="inline-start" aria-hidden="true" />
            )}
            {pending ? "Saliendo..." : "Salir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
