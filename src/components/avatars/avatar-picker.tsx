"use client";

import { AvatarPickerOption } from "@/components/avatars/avatar-picker-option";
import { predefinedAvatars } from "@/lib/avatars";

type AvatarPickerProps = {
  selectedUrl: string | null;
  onSelect: (url: string) => void;
};

export function AvatarPicker({ selectedUrl, onSelect }: AvatarPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Elige un avatar"
      className="grid grid-cols-4 gap-3 sm:grid-cols-6"
    >
      {predefinedAvatars.map((avatar) => (
        <AvatarPickerOption
          key={avatar.id}
          avatar={avatar}
          selected={avatar.url === selectedUrl}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
