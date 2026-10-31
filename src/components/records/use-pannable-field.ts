"use client";

import { play } from "cuelume";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import { useEffectEvent, useLayoutEffect, useMemo, useRef, useState } from "react";

type Bounds = { left: number; right: number; top: number; bottom: number };

export type FieldMotion = {
  panX: MotionValue<number>;
  panY: MotionValue<number>;
  focusX: MotionValue<number>;
  focusY: MotionValue<number>;
};

type PanMode = "idle" | "user" | "programmatic";

const DRAG_CLICK_THRESHOLD = 6;
const FOCUS_OFFSET_Y = 48;

const EDGE_PADDING = { left: 72, right: 72, top: 72, bottom: 72 };

function getAxisBounds(focus: number, content: number, start: number, end: number) {
  return [focus - content + end, focus - start] as const;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type UsePannableFieldOptions = {
  getFocusTarget: () => HTMLElement | null;
  onFocusChange: (element: HTMLElement) => void;
};

export function usePannableField({
  getFocusTarget,
  onFocusChange,
}: UsePannableFieldOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragDistance = useRef(0);
  const mode = useRef<PanMode>("idle");
  const frame = useRef<number | null>(null);
  const focusedElement = useRef<HTMLElement | null>(null);
  const controls = useRef<AnimationPlaybackControls[]>([]);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const focusX = useMotionValue(0);
  const focusY = useMotionValue(0);
  const [bounds, setBounds] = useState<Bounds>({ left: 0, right: 0, top: 0, bottom: 0 });
  const getInitialTarget = useEffectEvent(getFocusTarget);
  const fieldMotion = useMemo<FieldMotion>(
    () => ({ panX, panY, focusX, focusY }),
    [panX, panY, focusX, focusY],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) {
      return;
    }

    function measure(centerOnTarget: boolean) {
      if (!container || !content) {
        return;
      }

      const nextFocusX = container.clientWidth / 2;
      const nextFocusY = container.clientHeight / 2 - FOCUS_OFFSET_Y;
      focusX.set(nextFocusX);
      focusY.set(nextFocusY);

      const [left, right] = getAxisBounds(
        nextFocusX,
        content.offsetWidth,
        EDGE_PADDING.left,
        EDGE_PADDING.right,
      );
      const [top, bottom] = getAxisBounds(
        nextFocusY,
        content.offsetHeight,
        EDGE_PADDING.top,
        EDGE_PADDING.bottom,
      );
      setBounds({ left, right, top, bottom });

      const target = centerOnTarget ? getInitialTarget() : null;
      const nextX = target
        ? nextFocusX - (target.offsetLeft + target.offsetWidth / 2)
        : panX.get();
      const nextY = target
        ? nextFocusY - (target.offsetTop + target.offsetHeight / 2)
        : panY.get();

      panX.set(clamp(nextX, left, right));
      panY.set(clamp(nextY, top, bottom));
    }

    measure(true);

    const observer = new ResizeObserver(() => measure(false));
    observer.observe(container);

    return () => observer.disconnect();
  }, [panX, panY, focusX, focusY]);

  function findNearest() {
    frame.current = null;
    const content = contentRef.current;

    if (!content) {
      return;
    }

    const pointX = focusX.get() - panX.get();
    const pointY = focusY.get() - panY.get();
    let nearest: HTMLElement | null = null;
    let nearestDistance = Infinity;

    content.querySelectorAll<HTMLElement>("[data-emotion]").forEach((element) => {
      const distance = Math.hypot(
        element.offsetLeft + element.offsetWidth / 2 - pointX,
        element.offsetTop + element.offsetHeight / 2 - pointY,
      );

      if (distance < nearestDistance) {
        nearest = element;
        nearestDistance = distance;
      }
    });

    if (nearest && nearest !== focusedElement.current) {
      focusedElement.current = nearest;
      navigator.vibrate?.(6);
      play("select", { theme: "bubble", emphasis: "subtle" });
      onFocusChange(nearest);
    }
  }

  function scheduleFocusCheck() {
    if (mode.current !== "user" || frame.current !== null) {
      return;
    }

    frame.current = requestAnimationFrame(findNearest);
  }

  useMotionValueEvent(panX, "change", scheduleFocusCheck);
  useMotionValueEvent(panY, "change", scheduleFocusCheck);

  function stopAnimations() {
    controls.current.forEach((control) => control.stop());
    controls.current = [];
  }

  function startUserPan() {
    stopAnimations();
    mode.current = "user";
  }

  function centerOn(element: HTMLElement) {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    stopAnimations();
    mode.current = "programmatic";
    focusedElement.current = element;

    const targetX = focusX.get() - (element.offsetLeft + element.offsetWidth / 2);
    const targetY = focusY.get() - (element.offsetTop + element.offsetHeight / 2);
    const transition = { type: "spring", stiffness: 160, damping: 24 } as const;

    controls.current = [
      animate(panX, clamp(targetX, bounds.left, bounds.right), transition),
      animate(panY, clamp(targetY, bounds.top, bounds.bottom), {
        ...transition,
        onComplete: () => {
          mode.current = "idle";
        },
      }),
    ];
  }

  function handleWheel(event: React.WheelEvent) {
    startUserPan();
    const deltaX = event.shiftKey ? event.deltaY : event.deltaX;
    const deltaY = event.shiftKey ? 0 : event.deltaY;

    panX.set(clamp(panX.get() - deltaX, bounds.left, bounds.right));
    panY.set(clamp(panY.get() - deltaY, bounds.top, bounds.bottom));
  }

  return {
    containerRef,
    contentRef,
    bounds,
    fieldMotion,
    centerOn,
    handleWheel,
    dragHandlers: {
      onDragStart: () => {
        dragDistance.current = 0;
        startUserPan();
      },
      onDrag: (_: PointerEvent, info: { offset: { x: number; y: number } }) => {
        dragDistance.current = Math.hypot(info.offset.x, info.offset.y);
      },
      onPointerDownCapture: () => {
        dragDistance.current = 0;
        stopAnimations();
      },
      onClickCapture: (event: React.MouseEvent) => {
        if (dragDistance.current > DRAG_CLICK_THRESHOLD) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
    },
  };
}
