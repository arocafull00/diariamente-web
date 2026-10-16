"use client";

import { useSpring, type MotionValue } from "motion/react";
import { useLayoutEffect, useMemo } from "react";

export type SelectionPush = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  strength: MotionValue<number>;
};

const SPRING = { stiffness: 220, damping: 26 };

export function useSelectionPush(
  contentRef: React.RefObject<HTMLDivElement | null>,
  emotion: string | null,
): SelectionPush {
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const strength = useSpring(0, SPRING);

  useLayoutEffect(() => {
    const element = emotion
      ? contentRef.current?.querySelector<HTMLElement>(`[data-emotion="${CSS.escape(emotion)}"]`)
      : null;

    if (!element) {
      strength.set(0);
      return;
    }

    const nextX = element.offsetLeft + element.offsetWidth / 2;
    const nextY = element.offsetTop + element.offsetHeight / 2;

    if (strength.get() === 0) {
      x.jump(nextX);
      y.jump(nextY);
    } else {
      x.set(nextX);
      y.set(nextY);
    }

    strength.set(1);
  }, [contentRef, emotion, x, y, strength]);

  return useMemo(() => ({ x, y, strength }), [x, y, strength]);
}
