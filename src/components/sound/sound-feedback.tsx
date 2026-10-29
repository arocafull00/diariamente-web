"use client";

import { bind, play, setEnabled, type SoundName } from "cuelume";
import { useEffect, useRef } from "react";
import { useSonner } from "sonner";

import { useSoundStore } from "@/stores/sound-store";

const TOAST_SOUNDS: Partial<Record<string, SoundName>> = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "ready",
};

export function SoundFeedback() {
  const { toasts } = useSonner();
  const playedToasts = useRef(new Set<string | number>());
  const enabled = useSoundStore((state) => state.enabled);

  useEffect(() => bind(), []);

  useEffect(() => {
    setEnabled(enabled);
  }, [enabled]);

  useEffect(() => {
    for (const toast of toasts) {
      if (playedToasts.current.has(toast.id)) {
        continue;
      }

      playedToasts.current.add(toast.id);
      const sound = toast.type ? TOAST_SOUNDS[toast.type] : undefined;

      if (sound) {
        play(sound, {
          emphasis: "subtle",
          theme: sound === "success" ? "press" : undefined,
        });
      }
    }
  }, [toasts]);

  return null;
}
