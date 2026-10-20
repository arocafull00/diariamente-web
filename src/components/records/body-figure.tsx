"use client";

import { motion } from "motion/react";
import { useId, type ReactNode, type RefObject } from "react";

import { BodyFigureArt } from "@/components/records/body-figure-art";
import type { BodySensation } from "@/db/schema";
import { BODY_FIGURE_PATH } from "@/lib/body-figures";
import { cn } from "@/lib/utils";

type BodyFigureProjection = (x: number, y: number) => { left: string; top: string };

type ViewBox = { x: number; y: number; width: number; height: number };

type BodyFigureProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
  hitPathRef: RefObject<SVGPathElement | null>;
  handlers: React.DOMAttributes<HTMLDivElement>;
  viewBox: ViewBox;
  markerScale: number;
  interacting: boolean;
  sensations: BodySensation[];
  focusPoint: { x: number; y: number } | null;
  className?: string;
  children?: (project: BodyFigureProjection) => ReactNode;
};

export function BodyFigure({
  containerRef,
  svgRef,
  hitPathRef,
  handlers,
  viewBox,
  markerScale,
  interacting,
  sensations,
  focusPoint,
  className,
  children,
}: BodyFigureProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const project: BodyFigureProjection = (x, y) => ({
    left: `${((x - viewBox.x) / viewBox.width) * 100}%`,
    top: `${((y - viewBox.y) / viewBox.height) * 100}%`,
  });

  return (
    <div
      ref={containerRef}
      {...handlers}
      className={cn("relative cursor-pointer touch-none overflow-hidden select-none", className)}
    >
      <motion.svg
        ref={svgRef}
        initial={false}
        animate={{
          viewBox: `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`,
        }}
        transition={
          interacting
            ? { duration: 0 }
            : { type: "spring", stiffness: 120, damping: 22 }
        }
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <BodyFigureArt id={id} sensations={sensations} />
        <path
          ref={hitPathRef}
          d={BODY_FIGURE_PATH}
          fill="transparent"
          stroke="transparent"
          strokeWidth={6}
        />
        {focusPoint ? (
          <circle
            cx={focusPoint.x}
            cy={focusPoint.y}
            r={7 * markerScale}
            strokeWidth={3 * markerScale}
            className="fill-card stroke-foreground"
          />
        ) : null}
      </motion.svg>
      {children ? children(project) : null}
    </div>
  );
}
