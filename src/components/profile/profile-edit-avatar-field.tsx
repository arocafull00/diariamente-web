"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils-app";

const maxAvatarSizeBytes = 5 * 1024 * 1024;

type ProfileEditAvatarFieldProps = {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  imageUrl: string | null;
  onFileChange: (file: File | null) => void;
  onError: (message: string) => void;
};

export function ProfileEditAvatarField({
  firstName,
  lastName,
  avatarUrl,
  imageUrl,
  onFileChange,
  onError,
}: ProfileEditAvatarFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const resolvedAvatarUrl = previewUrl ?? avatarUrl ?? imageUrl ?? null;

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

  return (
    <div className="flex flex-col items-center gap-3">
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
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => inputRef.current?.click()}
      >
        <Camera className="size-4" />
        Cambiar foto
      </Button>
    </div>
  );
}
