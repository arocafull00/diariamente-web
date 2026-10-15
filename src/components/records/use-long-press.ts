"use client";

import { useRef } from "react";

const LONG_PRESS_DELAY = 550;
const MOVE_TOLERANCE = 8;

export function useLongPress(onLongPress: () => void) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggered = useRef(false);
  const origin = useRef({ x: 0, y: 0 });

  function clear() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function consumeTrigger() {
    const wasTriggered = triggered.current;
    triggered.current = false;
    return wasTriggered;
  }

  return {
    consumeTrigger,
    handlers: {
      onPointerDown: (event: React.PointerEvent) => {
        origin.current = { x: event.clientX, y: event.clientY };
        triggered.current = false;
        clear();
        timer.current = setTimeout(() => {
          triggered.current = true;
          navigator.vibrate?.(30);
          onLongPress();
        }, LONG_PRESS_DELAY);
      },
      onPointerMove: (event: React.PointerEvent) => {
        const distance = Math.hypot(
          event.clientX - origin.current.x,
          event.clientY - origin.current.y,
        );

        if (distance > MOVE_TOLERANCE) {
          clear();
        }
      },
      onPointerUp: clear,
      onPointerLeave: clear,
      onPointerCancel: clear,
      onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
    },
  };
}
