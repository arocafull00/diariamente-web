"use client";

import type { LucideIcon } from "lucide-react";

import { SheetTitle } from "@/components/ui/sheet";

type HeaderAction = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

type BodySensationsHeaderProps = {
  title: string;
  leading: HeaderAction;
  trailing?: HeaderAction;
};

const ACTION_CLASS_NAME =
  "flex size-11 shrink-0 items-center justify-center rounded-full bg-card/80 shadow-sm backdrop-blur outline-none transition-transform active:scale-90 focus-visible:ring-3 focus-visible:ring-ring/50";

export function BodySensationsHeader({ title, leading, trailing }: BodySensationsHeaderProps) {
  const LeadingIcon = leading.icon;
  const TrailingIcon = trailing?.icon;

  return (
    <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
      <button
        type="button"
        onClick={leading.onClick}
        aria-label={leading.label}
        className={ACTION_CLASS_NAME}
      >
        <LeadingIcon className="size-5" aria-hidden="true" />
      </button>
      <SheetTitle className="max-w-56 text-center text-base font-semibold text-balance">
        {title}
      </SheetTitle>
      {trailing && TrailingIcon ? (
        <button
          type="button"
          onClick={trailing.onClick}
          aria-label={trailing.label}
          className={ACTION_CLASS_NAME}
        >
          <TrailingIcon className="size-5" aria-hidden="true" />
        </button>
      ) : (
        <span className="size-11 shrink-0" aria-hidden="true" />
      )}
    </div>
  );
}
