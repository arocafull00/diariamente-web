"use client";

import type { LucideIcon } from "lucide-react";

import { BodySensationsHeaderAction } from "@/components/records/body-sensations-header-action";

type HeaderAction = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

type BodySensationsHeaderProps = {
  title: string;
  actions: HeaderAction[];
};

export function BodySensationsHeader({ title, actions }: BodySensationsHeaderProps) {
  return (
    <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-6 pt-4 pb-2">
      <h2 className="font-display text-2xl leading-tight font-medium text-balance">{title}</h2>
      <div className="flex shrink-0 gap-2">
        {actions.map((action) => (
          <BodySensationsHeaderAction
            key={action.label}
            icon={action.icon}
            label={action.label}
            onClick={action.onClick}
          />
        ))}
      </div>
    </div>
  );
}
