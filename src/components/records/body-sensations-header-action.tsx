"use client";

import type { LucideIcon } from "lucide-react";

type BodySensationsHeaderActionProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

export function BodySensationsHeaderAction({
  icon: Icon,
  label,
  onClick,
}: BodySensationsHeaderActionProps) {
  return (
    <button
      type="button"
      data-cuelume-close=""
      onClick={onClick}
      aria-label={label}
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card/80 shadow-sm backdrop-blur outline-none transition-transform active:scale-90 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
