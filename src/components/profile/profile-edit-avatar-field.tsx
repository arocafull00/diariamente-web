"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

import { AvatarPicker } from "@/components/avatars/avatar-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils-app";

const maxAvatarSizeBytes = 5 * 1024 * 1024;

type ProfileEditAvatarFieldProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  imageUrl: string | null;
  presetAvatarUrl: string | null;
  onFileChange: (file: File | null) => void;
  onPresetSelect: (url: string) => void;
  onError: (message: string) => void;
};

export function ProfileEditAvatarField({
  firstName,
  lastName,
  avatarUrl,
  imageUrl,
  presetAvatarUrl,
  onFileChange,
  onPresetSelect,
  onError,
}: ProfileEditAvatarFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const resolvedAvatarUrl =
    previewUrl ?? presetAvatarUrl ?? avatarUrl ?? imageUrl ?? null;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      onError("Selecciona una imagen válida");
      event.target.value = "";
      return;
    }

    if (file.size > maxAvatarSizeBytes) {
      onError("La imagen no puede superar 5 MB");
      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
    onFileChange(file);
  }

  function handlePresetSelect(url: string) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setPreviewUrl(null);
    onPresetSelect(url);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="size-24 text-lg">
        {resolvedAvatarUrl ? (
          <AvatarImage src={resolvedAvatarUrl} alt="" />
        ) : null}
        <AvatarFallback className="text-xl">
          {getInitials(firstName, lastName)}
        </AvatarFallback>
      </Avatar>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <Button
        type="button"
        variant="secondary"
        onClick={() => inputRef.current?.click()}
      >
        <Camera data-icon="inline-start" aria-hidden="true" />
        Cambiar foto
      </Button>
      <AvatarPicker
        selectedUrl={previewUrl ? null : presetAvatarUrl}
        onSelect={handlePresetSelect}
      />
    </div>
  );
}
