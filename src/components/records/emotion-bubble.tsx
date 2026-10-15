"use client";

import { motion, useTransform } from "motion/react";
import { useLayoutEffect, useRef } from "react";

import type { FieldMotion } from "@/components/records/use-pannable-field";
import { useLongPress } from "@/components/records/use-long-press";
import type { MoodQuadrant } from "@/db/schema";
import { CIRCLE_CLIP_PATH, getEmotionShape } from "@/lib/emotion-shapes";
import type { MoodStyles, MoodTone } from "@/lib/emotions";
import { cn } from "@/lib/utils";

type EmotionBubbleProps = {
  name: string;
  quadrant: MoodQuadrant;
  tone: MoodTone;
  styles: MoodStyles;
  selected: boolean;
  delay: number;
  field: FieldMotion;
  onSelect: (name: string) => void;
  onQuickSave: (name: string) => void;
};

const FISHEYE_RADIUS = 340;
const FISHEYE_MIN_SCALE = 0.5;

export function EmotionBubble({
  name,
  quadrant,
  tone,
  styles,
  selected,
  delay,
  field,
  onSelect,
  onQuickSave,
}: EmotionBubbleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const home = useRef({ x: 0, y: 0 });
  const shape = getEmotionShape(name);
  const { handlers, consumeTrigger } = useLongPress(() => onQuickSave(name));

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    home.current = {
      x: element.offsetLeft + element.offsetWidth / 2,
      y: element.offsetTop + element.offsetHeight / 2,
    };
  }, []);

  const scale = useTransform(() => {
    const dx = home.current.x + field.panX.get() - field.focusX.get();
    const dy = (home.current.y + field.panY.get() - field.focusY.get()) * 0.8;
    const ratio = Math.min(Math.hypot(dx, dy) / FISHEYE_RADIUS, 1);
    return 1.08 - (1.08 - FISHEYE_MIN_SCALE) * ratio * ratio;
  });

  return (
    <motion.div
      ref={ref}
      data-emotion={name}
      data-quadrant={quadrant}
      style={{ scale }}
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
          {...handlers}
          onClick={() => {
            if (consumeTrigger()) {
              return;
            }

            onSelect(name);
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
            "relative flex size-22 items-center justify-center p-2 text-center font-display text-[0.8rem] leading-tight font-medium text-mood-foreground outline-none select-none [-webkit-touch-callout:none] focus-visible:brightness-110 sm:size-24 sm:text-sm",
            styles.tones[tone],
            selected && styles.tones[3],
          )}
        >
          <span
            className="pointer-events-none absolute inset-0 bg-radial-[at_30%_25%] from-white/50 via-transparent to-transparent"
            aria-hidden="true"
          />
          <motion.span
            className={cn("relative", selected && "font-semibold")}
            initial={false}
            animate={{
              rotate: selected ? -shape.rotate : 0,
              scale: selected ? 1 / shape.scale + 0.12 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: shape.stiffness,
              damping: shape.damping,
            }}
          >
            {name}
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
