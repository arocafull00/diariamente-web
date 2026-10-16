"use client";

import { motion } from "motion/react";
import { useId, type ReactNode } from "react";

import { BodyFigurePart } from "@/components/records/body-figure-part";
import { BodySensationGlow } from "@/components/records/body-sensation-glow";
import { useElementSize } from "@/components/records/use-element-size";
import type { BodyFigure as BodyFigureId, BodySensation } from "@/db/schema";
import { BODY_FIGURES, BODY_FIGURE_VIEWBOX } from "@/lib/body-figures";
import {
  BODY_REGIONS,
  findNearestBodyRegion,
  type BodyRegionId,
} from "@/lib/body-sensations";
import { cn } from "@/lib/utils";

type ViewBox = { x: number; y: number; width: number; height: number };

type BodyFigureProjection = (x: number, y: number) => { left: string; top: string };

type BodyFigureProps = {
  figure: BodyFigureId;
  sensations: BodySensation[];
  focusRegion?: BodyRegionId | null;
  zoom?: number;
  onSelectRegion?: (region: BodyRegionId) => void;
  className?: string;
  children?: (project: BodyFigureProjection) => ReactNode;
};

const FIGURE_PADDING = 8;

function getViewBox(
  size: { width: number; height: number },
  focusRegion: BodyRegionId | null,
  zoom: number,
): ViewBox {
  const figureWidth = BODY_FIGURE_VIEWBOX.width + FIGURE_PADDING * 2;
  const figureHeight = BODY_FIGURE_VIEWBOX.height + FIGURE_PADDING * 2;

  if (size.width === 0 || size.height === 0) {
    return { x: -FIGURE_PADDING, y: -FIGURE_PADDING, width: figureWidth, height: figureHeight };
  }

  const fitScale = Math.min(size.width / figureWidth, size.height / figureHeight);
  const scale = focusRegion ? fitScale * zoom : fitScale;
  const width = size.width / scale;
  const height = size.height / scale;
  const center = focusRegion
    ? BODY_REGIONS[focusRegion]
    : { x: BODY_FIGURE_VIEWBOX.width / 2, y: BODY_FIGURE_VIEWBOX.height / 2 };

  return { x: center.x - width / 2, y: center.y - height / 2, width, height };
}

export function BodyFigure({
  figure,
  sensations,
  focusRegion = null,
  zoom = 2.6,
  onSelectRegion,
  className,
  children,
}: BodyFigureProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { ref, size } = useElementSize<HTMLDivElement>();
  const parts = BODY_FIGURES[figure];
  const focus = focusRegion ? BODY_REGIONS[focusRegion] : null;
  const viewBox = getViewBox(size, focusRegion, zoom);
  const markerScale = viewBox.width / Math.max(size.width, 1);

  const project: BodyFigureProjection = (x, y) => ({
    left: `${((x - viewBox.x) / viewBox.width) * 100}%`,
    top: `${((y - viewBox.y) / viewBox.height) * 100}%`,
  });

  function handleClick(event: React.MouseEvent<SVGGElement>) {
    const matrix = event.currentTarget.ownerSVGElement?.getScreenCTM();

    if (!matrix || !onSelectRegion) {
      return;
    }

    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    onSelectRegion(findNearestBodyRegion(point.x, point.y));
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.svg
        initial={false}
        animate={{
          viewBox: `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
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
            {parts.map((part, index) => (
              <BodyFigurePart key={index} part={part} paint="white" />
            ))}
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
        {onSelectRegion ? (
          <g onClick={handleClick} className="cursor-pointer">
            {parts.map((part, index) => (
              <BodyFigurePart key={index} part={part} paint="transparent" />
            ))}
          </g>
        ) : null}
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
