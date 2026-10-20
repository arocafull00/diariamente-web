"use client";

import { motion } from "motion/react";
import { useId, type ReactNode, type RefObject } from "react";

import { BodySensationGlow } from "@/components/records/body-sensation-glow";
import type { BodySensation } from "@/db/schema";
import { BODY_FIGURE_PATH, BODY_FIGURE_VIEWBOX } from "@/lib/body-figures";
import { BODY_REGIONS, type BodyRegionId } from "@/lib/body-sensations";
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
  focusRegion: BodyRegionId | null;
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
  focusRegion,
  className,
  children,
}: BodyFigureProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const focus = focusRegion ? BODY_REGIONS[focusRegion] : null;

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
        <defs>
          <pattern
            id={`${id}-dots`}
            width="3"
            height="3"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="0.7" className="fill-foreground" />
          </pattern>
          <mask id={`${id}-mask`}>
            <path d={BODY_FIGURE_PATH} fill="white" />
          </mask>
          <filter id={`${id}-blur`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <g mask={`url(#${id}-mask)`}>
          <rect
            width={BODY_FIGURE_VIEWBOX.width}
            height={BODY_FIGURE_VIEWBOX.height}
            className="fill-foreground"
            opacity={0.06}
          />
          {sensations.map((sensation) => (
            <BodySensationGlow
              key={sensation.region}
              sensation={sensation}
              filterId={`${id}-blur`}
            />
          ))}
          <rect
            width={BODY_FIGURE_VIEWBOX.width}
            height={BODY_FIGURE_VIEWBOX.height}
            fill={`url(#${id}-dots)`}
            opacity={0.55}
          />
        </g>
        <path ref={hitPathRef} d={BODY_FIGURE_PATH} fill="transparent" />
        {focus ? (
          <circle
            cx={focus.x}
            cy={focus.y}
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
