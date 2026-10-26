"use client";

import { BodySideToggleOption } from "@/components/records/body-side-toggle-option";
import type { BodySide } from "@/db/schema";
import { BODY_SIDES } from "@/lib/body-sensations";
import { cn } from "@/lib/utils";

type BodySideToggleProps = {
  value: BodySide;
  onChange: (side: BodySide) => void;
  className?: string;
};

export function BodySideToggle({ value, onChange, className }: BodySideToggleProps) {
  return (
    <div
      role="group"
      aria-label="Lado del cuerpo"
      className={cn(
        "flex gap-1 rounded-full bg-card/90 p-1 shadow-sm ring-1 ring-border/60 backdrop-blur",
        className,
      )}
    >
      {BODY_SIDES.map((side) => (
        <BodySideToggleOption
          key={side}
          side={side}
          selected={value === side}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}
