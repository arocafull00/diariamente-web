"use client";

import { motion, useTransform } from "motion/react";
import { memo, useLayoutEffect, useRef } from "react";

import type { FieldMotion } from "@/components/records/use-pannable-field";
import { useLongPress } from "@/components/records/use-long-press";
import type { SelectionPush } from "@/components/records/use-selection-push";
import type { MoodQuadrant } from "@/db/schema";
import { CIRCLE_CLIP_PATH, getEmotionShape } from "@/lib/emotion-shapes";
import type { MoodStyles, MoodTone } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type EmotionBubbleProps = {
  name: string;
  label: string;
  quadrant: MoodQuadrant;
  group: string;
  tone: MoodTone;
  styles: MoodStyles;
  selected: boolean;
  delay: number;
  field: FieldMotion;
  selection: SelectionPush;
  onSelect: (name: string, quadrant: MoodQuadrant, group: string) => void;
  onQuickSave: (name: string, quadrant: MoodQuadrant, group: string) => void;
};

const FISHEYE_RADIUS = 560;
const FISHEYE_MAX_SCALE = 1.05;
const FISHEYE_MIN_SCALE = 0.88;
const FISHEYE_DROP = FISHEYE_MAX_SCALE - FISHEYE_MIN_SCALE;
const PUSH_MAX = 24;

function getFisheyeScale(distance: number) {
  const ratio = Math.min(distance / FISHEYE_RADIUS, 1);
  return FISHEYE_MAX_SCALE - FISHEYE_DROP * ratio * ratio;
}

function getPushOffset(along: number, across: number, cell: number) {
  const direction = Math.min(Math.max(along / cell, -1), 1);
  const band = Math.max(0, 1 - Math.abs(across) / cell);
  return PUSH_MAX * direction * band;
}

export const EmotionBubble = memo(function EmotionBubble({
  name,
  label,
  quadrant,
  group,
  tone,
  styles,
  selected,
  delay,
  field,
  selection,
  onSelect,
  onQuickSave,
}: EmotionBubbleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const home = useRef({ x: 0, y: 0, cell: 1 });
  const shape = getEmotionShape(name);
  const { handlers, consumeTrigger } = useLongPress(() => onQuickSave(name, quadrant, group));

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    home.current = {
      x: element.offsetLeft + element.offsetWidth / 2,
      y: element.offsetTop + element.offsetHeight / 2,
      cell: element.offsetWidth,
    };
  }, []);

  const getDelta = () => ({
    dx: home.current.x + field.panX.get() - field.focusX.get(),
    dy: home.current.y + field.panY.get() - field.focusY.get(),
  });

  const scale = useTransform(() => {
    const { dx, dy } = getDelta();
    return getFisheyeScale(Math.hypot(dx, dy));
  });

  const getSelectionDelta = () => ({
    dx: home.current.x - selection.x.get(),
    dy: home.current.y - selection.y.get(),
  });

  const x = useTransform(() => {
    const { dx, dy } = getSelectionDelta();
    return getPushOffset(dx, dy, home.current.cell) * selection.strength.get();
  });

  const y = useTransform(() => {
    const { dx, dy } = getSelectionDelta();
    return getPushOffset(dy, dx, home.current.cell) * selection.strength.get();
  });

  return (
    <motion.div
      ref={ref}
      data-emotion={name}
      data-quadrant={quadrant}
      data-group={group}
      style={{ x, y, scale }}
      className={cn("relative", selected && "z-10")}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.2, rotate: -20 }}
        animate={{
          opacity: 1,
          scale: selected ? [1, 1.06, 1] : 1,
          rotate: 0,
        }}
        transition={
          selected
            ? { scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }
            : { type: "spring", stiffness: 240, damping: 18, delay }
        }
        className={cn(
          "transition-[filter] duration-300",
          selected && "drop-shadow-[0_12px_18px_rgb(0_0_0/0.22)]",
        )}
      >
        <motion.button
          type="button"
          data-cuelume-select="type"
          data-cuelume-theme="bubble"
          {...handlers}
          onClick={() => {
            if (consumeTrigger()) {
              return;
            }

            onSelect(name, quadrant, group);
          }}
          aria-pressed={selected}
          initial={false}
          animate={{
            clipPath: selected ? shape.clipPath : CIRCLE_CLIP_PATH,
            rotate: selected ? shape.rotate : 0,
            scale: selected ? shape.scale : 1,
          }}
          whileTap={{ scale: selected ? shape.scale * 0.92 : 0.88 }}
          transition={{
            type: "spring",
            stiffness: shape.stiffness,
            damping: shape.damping,
          }}
          className={cn(
            "relative flex size-36 items-center justify-center p-3 text-center font-display text-lg leading-tight font-medium text-mood-foreground outline-none select-none [-webkit-touch-callout:none] focus-visible:brightness-110 sm:size-40 sm:text-xl",
            styles.tones[tone],
            selected && styles.tones[3],
          )}
        >
          <motion.span
            className={cn("relative", selected && "font-semibold")}
            initial={false}
            animate={{
              rotate: selected ? -shape.rotate : 0,
              scale: selected ? 1 / shape.scale + 0.04 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: shape.stiffness,
              damping: shape.damping,
            }}
          >
            {label}
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
});
