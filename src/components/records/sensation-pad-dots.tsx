import { SensationPadDot } from "@/components/records/sensation-pad-dot";
import {
  SENSATION_FILLS,
  getSensationQuadrant,
  type SensationValue,
} from "@/lib/body-sensations";
import { cn } from "@/lib/utils";

type SensationPadDotsProps = {
  value: SensationValue | null;
  density?: number;
  className?: string;
};

const GLOW_RADIUS = 24;

export function SensationPadDots({ value, density = 11, className }: SensationPadDotsProps) {
  const step = 100 / density;
  const positions = Array.from({ length: density }, (_, index) => step / 2 + index * step);
  const fillClassName = value ? SENSATION_FILLS[getSensationQuadrant(value)] : "";

  function getGlow(cx: number, cy: number) {
    if (!value) {
      return 0;
    }

    const distance = Math.hypot(cx - value.pleasantness, cy - (100 - value.intensity));

    return Math.max(0, 1 - distance / GLOW_RADIUS);
  }

  return (
    <svg viewBox="0 0 100 100" className={cn("size-full", className)} aria-hidden="true">
      {positions.flatMap((cy) =>
        positions.map((cx) => (
          <SensationPadDot
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            glow={getGlow(cx, cy)}
            fillClassName={fillClassName}
          />
        )),
      )}
    </svg>
  );
}
