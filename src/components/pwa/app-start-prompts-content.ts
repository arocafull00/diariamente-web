import { Bell, Download, type LucideIcon } from "lucide-react";

export type AppStartPromptId = "notifications" | "install";

export type AppStartPromptCopy = {
  panelClassName: string;
  accentClassName: string;
  title: string;
  highlight: string;
  description: string;
  note: string;
  action: string;
  icon: LucideIcon;
};

type NotificationPromptCopy = AppStartPromptCopy & {
  preview: { title: string; body: string };
};

const NOTIFICATION_PROMPT_BASE = {
  panelClassName: "bg-mood-hp-soft",
  accentClassName: "text-mood-hp-strong",
  note: "Nunca mostramos el contenido de los registros en las notificaciones.",
  action: "Activar notificaciones",
  icon: Bell,
};

export const NOTIFICATION_PROMPTS: Record<"patient" | "psychologist", NotificationPromptCopy> = {
  patient: {
    ...NOTIFICATION_PROMPT_BASE,
    title: "¿Te aviso de lo",
    highlight: "importante?",
    description:
      "Así tu psicólogo/a podrá recordarte cosas entre sesiones y cada noche te avisaré para registrar tu día.",
    preview: {
      title: "¿Cómo ha ido tu día?",
      body: "Tómate un minuto para registrar cómo te sientes.",
    },
  },
  psychologist: {
    ...NOTIFICATION_PROMPT_BASE,
    title: "No te pierdas",
    highlight: "nada",
    description:
      "Te avisaré cuando un paciente quiera conectar contigo o añada un registro nuevo.",
    preview: {
      title: "Nuevo registro",
      body: "Un paciente ha añadido un registro nuevo.",
    },
  },
};

export const INSTALL_PROMPT: AppStartPromptCopy = {
  panelClassName: "bg-mood-lp-soft",
  accentClassName: "text-mood-lp-strong",
  title: "¡Llévame en el",
  highlight: "bolsillo!",
  description:
    "Añade Diariamente a tu pantalla de inicio para abrirla como una app, sin pasar por el navegador.",
  note: "También puedes instalarla más tarde desde Ajustes.",
  action: "Descargar la aplicación",
  icon: Download,
};
