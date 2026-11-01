import { ChevronRight } from "lucide-react";

import { PressableLink } from "@/components/motion/pressable-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  formatLastActivityLabel,
  getFullName,
  getInitials,
} from "@/lib/utils-app";

type ClinicPsychologistCardProps = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  patients: number;
  records7d: number;
  lastActiveAt: Date;
};

export function ClinicPsychologistCard({
  id,
  firstName,
  lastName,
  avatarUrl,
  patients,
  records7d,
  lastActiveAt,
}: ClinicPsychologistCardProps) {
  return (
    <PressableLink
      href={`/clinica/psicologos/${id}`}
      className="group block rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-sm ring-1 ring-border/60 transition-shadow duration-200 ease-out group-hover:shadow-md">
        <Avatar className="size-11 rounded-xl after:rounded-xl">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="" className="rounded-xl" />
          ) : null}
          <AvatarFallback className="rounded-xl bg-secondary text-sm font-semibold text-primary ring-1 ring-secondary">
            {getInitials(firstName, lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {getFullName(firstName, lastName)}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {patients} {patients === 1 ? "paciente" : "pacientes"} · {records7d}{" "}
            {records7d === 1 ? "registro" : "registros"} esta semana
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            Última conexión: {formatLastActivityLabel(lastActiveAt)}
          </p>
        </div>
        <ChevronRight
          className="size-5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </PressableLink>
  );
}
