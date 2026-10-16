"use client";

import { useRef } from "react";

import { SENSATION_MIDPOINT, type SensationValue } from "@/lib/body-sensations";

type UseSensationPadOptions = {
  value: SensationValue | null;
  onChange: (value: SensationValue) => void;
  onCommit: (value: SensationValue) => void;
};

const KEYBOARD_STEP = 5;

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

const KEY_DELTAS: Record<string, [number, number]> = {
  ArrowLeft: [-KEYBOARD_STEP, 0],
  ArrowRight: [KEYBOARD_STEP, 0],
  ArrowUp: [0, KEYBOARD_STEP],
  ArrowDown: [0, -KEYBOARD_STEP],
};

export function useSensationPad({ value, onChange, onCommit }: UseSensationPadOptions) {
  const areaRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const current = value ?? { pleasantness: SENSATION_MIDPOINT, intensity: SENSATION_MIDPOINT };

  function read(event: React.PointerEvent): SensationValue | null {
    const rect = areaRef.current?.getBoundingClientRect();

    if (!rect) {
      return null;
    }

    return {
      pleasantness: Math.round(clamp(((event.clientX - rect.left) / rect.width) * 100)),
      intensity: Math.round(clamp((1 - (event.clientY - rect.top) / rect.height) * 100)),
    };
  }

  function update(event: React.PointerEvent) {
    const next = read(event);

    if (next) {
      onChange(next);
    }

    return next;
  }

  return {
    areaRef,
    handlers: {
      onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        dragging.current = true;
        update(event);
      },
      onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
        if (dragging.current) {
          update(event);
        }
      },
      onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) {
          return;
        }

        dragging.current = false;
        const next = update(event);

        if (next) {
          navigator.vibrate?.(8);
          onCommit(next);
        }
      },
      onPointerCancel: () => {
        dragging.current = false;
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onCommit(current);
          return;
        }

        const delta = KEY_DELTAS[event.key];

        if (!delta) {
          return;
        }

        event.preventDefault();
        onChange({
          pleasantness: clamp(current.pleasantness + delta[0]),
          intensity: clamp(current.intensity + delta[1]),
        });
      },
    },
  };
}
