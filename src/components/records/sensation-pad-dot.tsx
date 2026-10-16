import { cn } from "@/lib/utils";

type SensationPadDotProps = {
  cx: number;
  cy: number;
  glow: number;
  fillClassName: string;
};

export function SensationPadDot({ cx, cy, glow, fillClassName }: SensationPadDotProps) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={1.3 + glow * 1.8}
      opacity={glow > 0 ? 0.35 + glow * 0.65 : 0.2}
      className={cn("transition-[r,opacity] duration-150", glow > 0 ? fillClassName : "fill-foreground")}
    />
  );
}
