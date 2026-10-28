"use client";

import { useEffect, useRef, useState } from "react";

import { Face } from "@/components/faces/face";
import { DECORATIVE_FACE_IDS, type FaceId } from "@/lib/faces";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_FACES = 4;
const STEP_MS = 650;

type LoadingFace = {
  key: number;
  faceId: FaceId;
  leaving: boolean;
};

export function SsoLoadingFaces() {
  const nextKey = useRef(1);
  const [faces, setFaces] = useState<LoadingFace[]>(() => [
    { key: 0, faceId: DECORATIVE_FACE_IDS[0], leaving: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const key = nextKey.current++;
      const next: LoadingFace = {
        key,
        faceId: DECORATIVE_FACE_IDS[key % DECORATIVE_FACE_IDS.length],
        leaving: false,
      };

      setFaces((current) => {
        const active = current.filter((face) => !face.leaving);

        if (active.length < MAX_VISIBLE_FACES) {
          return [...active, next];
        }

        const [first, ...rest] = active;
        return [{ ...first, leaving: true }, ...rest, next];
      });
    }, STEP_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-16 items-center justify-center gap-2" role="status">
      {faces.map((face) => (
        <Face
          key={face.key}
          faceId={face.faceId}
          size={64}
          priority
          className={cn(
            "size-12 shrink-0 drop-shadow-sm",
            face.leaving
              ? "motion-safe:animate-face-exit motion-reduce:hidden"
              : "motion-safe:animate-face-enter",
          )}
        />
      ))}
      <span className="sr-only">Completando inicio de sesión</span>
    </div>
  );
}
