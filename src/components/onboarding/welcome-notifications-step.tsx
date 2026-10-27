import Image from "next/image";

import logo from "../../../public/logo.png";

const NOTIFICATION_PREVIEWS = {
  patient: {
    title: "¿Cómo ha ido tu día?",
    body: "Tómate un minuto para registrar cómo te sientes.",
  },
  psychologist: {
    title: "Nuevo registro",
    body: "Un paciente ha añadido un registro nuevo.",
  },
} as const;

type WelcomeNotificationsStepProps = {
  role: "patient" | "psychologist";
};

export function WelcomeNotificationsStep({ role }: WelcomeNotificationsStepProps) {
  const preview = NOTIFICATION_PREVIEWS[role];

  return (
    <div className="space-y-4">
      <div
        aria-hidden="true"
        className="flex items-start gap-3 rounded-3xl border-2 border-border bg-card px-4 py-3.5 shadow-md motion-safe:animate-mood-float"
      >
        <Image
          src={logo}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-xl object-contain"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-semibold text-foreground/65">Diariamente</p>
            <p className="text-xs text-foreground/50">ahora</p>
          </div>
          <p className="mt-0.5 font-semibold">{preview.title}</p>
          <p className="text-sm leading-5 text-foreground/70">{preview.body}</p>
        </div>
      </div>
      <p className="px-1 text-center text-sm text-foreground/65">
        Nunca mostramos el contenido de los registros en las notificaciones.
      </p>
    </div>
  );
}
