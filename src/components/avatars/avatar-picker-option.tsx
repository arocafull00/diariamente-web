"use client";

import { Check } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { PredefinedAvatar } from "@/lib/avatars";
import { cn } from "@/lib/utils";

type AvatarPickerOptionProps = {
  avatar: PredefinedAvatar;
  selected: boolean;
  onSelect: (url: string) => void;
};

export function AvatarPickerOption({
  avatar,
  selected,
  onSelect,
}: AvatarPickerOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={avatar.label}
      onClick={() => onSelect(avatar.url)}
      className={cn(
        "relative flex items-center justify-center rounded-full p-0.5 transition-colors",
        selected ? "ring-2 ring-ring" : "ring-1 ring-transparent",
      )}
    >
      <Avatar className="size-14">
        <AvatarImage src={avatar.url} alt="" />
      </Avatar>
      {selected ? (
        <span className="absolute right-0 bottom-0 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" aria-hidden="true" />
        </span>
      ) : null}
    </button>
  );
}
