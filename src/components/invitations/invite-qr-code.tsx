import { encode } from "uqr";

import { cn } from "@/lib/utils";

type InviteQrCodeProps = {
  value: string;
  className?: string;
};

export function InviteQrCode({ value, className }: InviteQrCodeProps) {
  const { data, size } = encode(value, { ecc: "M", border: 0 });

  const path = data
    .flatMap((row, y) =>
      row.map((dark, x) => (dark ? `M${x} ${y}h1v1h-1z` : "")),
    )
    .join("");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Código QR de invitación"
      className={cn("fill-current text-foreground", className)}
    >
      <path d={path} />
    </svg>
  );
}
