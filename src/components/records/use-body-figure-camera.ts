"use client";

import { useRef, useState } from "react";

import { useElementSize } from "@/components/records/use-element-size";
import { BODY_FIGURE_VIEWBOX } from "@/lib/body-figures";

type Point = { x: number; y: number };

type Size = { width: number; height: number };

type Camera = { scale: number; center: Point };

type Gesture = {
  origin: Point;
  start: Camera;
  startDistance: number;
  anchor: Point;
  moved: boolean;
  multiTouch: boolean;
  dragging: boolean;
};

type UseBodyFigureCameraOptions = {
  onTap: (point: Point) => void;
  dragPoint: Point | null;
  onDrag: (point: Point) => void;
};

const FIGURE_PADDING = 8;
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const FOCUS_SCALE = 1.6;
const TAP_THRESHOLD = 8;
const DRAG_RADIUS = 28;

const FIGURE_BOUNDS = {
  minX: -FIGURE_PADDING,
  maxX: BODY_FIGURE_VIEWBOX.width + FIGURE_PADDING,
  minY: -FIGURE_PADDING,
  maxY: BODY_FIGURE_VIEWBOX.height + FIGURE_PADDING,
};

const INITIAL_CAMERA: Camera = {
  scale: MIN_SCALE,
  center: { x: BODY_FIGURE_VIEWBOX.width / 2, y: BODY_FIGURE_VIEWBOX.height / 2 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampScale(scale: number) {
  return clamp(scale, MIN_SCALE, MAX_SCALE);
}

function clampAxis(value: number, span: number, min: number, max: number) {
  if (span >= max - min) {
    return (min + max) / 2;
  }

  return clamp(value, min + span / 2, max - span / 2);
}

function getUnitsPerPixel(size: Size, scale: number) {
  const fitScale = Math.min(
    size.width / (FIGURE_BOUNDS.maxX - FIGURE_BOUNDS.minX),
    size.height / (FIGURE_BOUNDS.maxY - FIGURE_BOUNDS.minY),
  );

  return 1 / (fitScale * scale);
}

function getViewBox(size: Size, camera: Camera) {
  if (size.width === 0 || size.height === 0) {
    return {
      x: FIGURE_BOUNDS.minX,
      y: FIGURE_BOUNDS.minY,
      width: FIGURE_BOUNDS.maxX - FIGURE_BOUNDS.minX,
      height: FIGURE_BOUNDS.maxY - FIGURE_BOUNDS.minY,
    };
  }

  const unitsPerPixel = getUnitsPerPixel(size, camera.scale);
  const width = size.width * unitsPerPixel;
  const height = size.height * unitsPerPixel;
  const x = clampAxis(camera.center.x, width, FIGURE_BOUNDS.minX, FIGURE_BOUNDS.maxX);
  const y = clampAxis(camera.center.y, height, FIGURE_BOUNDS.minY, FIGURE_BOUNDS.maxY);

  return { x: x - width / 2, y: y - height / 2, width, height };
}

function getMidpoint(points: Point[]): Point {
  return {
    x: (points[0].x + points[1].x) / 2,
    y: (points[0].y + points[1].y) / 2,
  };
}

function getDistance(points: Point[]) {
  return Math.max(Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y), 1);
}

export function useBodyFigureCamera({ onTap, dragPoint, onDrag }: UseBodyFigureCameraOptions) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const hitPathRef = useRef<SVGPathElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture | null>(null);
  const [camera, setCamera] = useState<Camera>(INITIAL_CAMERA);
  const [interacting, setInteracting] = useState(false);
  const viewBox = getViewBox(size, camera);
  const center = { x: viewBox.x + viewBox.width / 2, y: viewBox.y + viewBox.height / 2 };
  const current: Camera = { scale: camera.scale, center };

  function toFigurePoint(client: Point): Point {
    const rect = ref.current?.getBoundingClientRect();

    if (!rect || rect.width === 0 || rect.height === 0) {
      return center;
    }

    return {
      x: viewBox.x + ((client.x - rect.left) / rect.width) * viewBox.width,
      y: viewBox.y + ((client.y - rect.top) / rect.height) * viewBox.height,
    };
  }

  function beginGesture(multiTouch: boolean, dragging = false) {
    const points = [...pointers.current.values()];
    const pinch = points.length >= 2;

    gesture.current = {
      origin: pinch ? getMidpoint(points) : points[0],
      start: current,
      startDistance: pinch ? getDistance(points) : 1,
      anchor: toFigurePoint(pinch ? getMidpoint(points) : points[0]),
      moved: gesture.current?.moved ?? false,
      multiTouch,
      dragging: dragging && !pinch,
    };
  }

  function getFigurePointOnBody(client: Point) {
    const matrix = svgRef.current?.getScreenCTM();
    const path = hitPathRef.current;

    if (!matrix || !path) {
      return null;
    }

    const point = new DOMPoint(client.x, client.y).matrixTransform(matrix.inverse());

    if (!path.isPointInFill(point) && !path.isPointInStroke(point)) {
      return null;
    }

    return { x: point.x, y: point.y };
  }

  function isNearDragPoint(client: Point) {
    const matrix = svgRef.current?.getScreenCTM();

    if (!dragPoint || !matrix) {
      return false;
    }

    const screen = new DOMPoint(dragPoint.x, dragPoint.y).matrixTransform(matrix);

    return Math.hypot(screen.x - client.x, screen.y - client.y) <= DRAG_RADIUS;
  }

  function selectAt(client: Point) {
    const point = getFigurePointOnBody(client);

    if (point) {
      onTap(point);
    }
  }

  function endGesture(event: React.PointerEvent<HTMLDivElement>, allowTap: boolean) {
    if (!pointers.current.delete(event.pointerId)) {
      return;
    }

    const active = gesture.current;

    if (pointers.current.size > 0) {
      beginGesture(true);
      return;
    }

    gesture.current = null;
    setInteracting(false);

    if (allowTap && active && !active.moved && !active.multiTouch) {
      selectAt({ x: event.clientX, y: event.clientY });
    }
  }

  return {
    ref,
    svgRef,
    hitPathRef,
    viewBox,
    markerScale: viewBox.width / Math.max(size.width, 1),
    interacting,
    reset: () => setCamera(INITIAL_CAMERA),
    focusOn: (point: Point) =>
      setCamera((value) => ({
        scale: Math.max(value.scale, FOCUS_SCALE),
        center: point,
      })),
    handlers: {
      onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.target instanceof Element && event.target.closest("button")) {
          return;
        }

        const client = { x: event.clientX, y: event.clientY };

        event.currentTarget.setPointerCapture(event.pointerId);
        pointers.current.set(event.pointerId, client);
        beginGesture(
          pointers.current.size > 1,
          pointers.current.size === 1 && isNearDragPoint(client),
        );
      },
      onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
        const active = gesture.current;

        if (!active || !pointers.current.has(event.pointerId)) {
          return;
        }

        pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
        const points = [...pointers.current.values()];
        const rect = event.currentTarget.getBoundingClientRect();

        if (points.length >= 2) {
          const midpoint = getMidpoint(points);
          const scale = clampScale(
            active.start.scale * (getDistance(points) / active.startDistance),
          );
          const unitsPerPixel = getUnitsPerPixel(size, scale);

          active.moved = true;
          setInteracting(true);
          setCamera({
            scale,
            center: {
              x: active.anchor.x - (midpoint.x - rect.left - rect.width / 2) * unitsPerPixel,
              y: active.anchor.y - (midpoint.y - rect.top - rect.height / 2) * unitsPerPixel,
            },
          });
          return;
        }

        if (active.dragging) {
          const point = getFigurePointOnBody({ x: event.clientX, y: event.clientY });

          active.moved = true;

          if (point) {
            onDrag(point);
          }
          return;
        }

        const deltaX = event.clientX - active.origin.x;
        const deltaY = event.clientY - active.origin.y;

        if (!active.moved && Math.hypot(deltaX, deltaY) < TAP_THRESHOLD) {
          return;
        }

        const unitsPerPixel = getUnitsPerPixel(size, active.start.scale);

        active.moved = true;
        setInteracting(true);
        setCamera({
          scale: active.start.scale,
          center: {
            x: active.start.center.x - deltaX * unitsPerPixel,
            y: active.start.center.y - deltaY * unitsPerPixel,
          },
        });
      },
      onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => endGesture(event, true),
      onPointerCancel: (event: React.PointerEvent<HTMLDivElement>) => endGesture(event, false),
    },
  };
}
