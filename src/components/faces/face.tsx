import Image from "next/image";
import type { CSSProperties } from "react";

import { getFaceUrl, type FaceId } from "@/lib/faces";

type FaceProps = {
  faceId: FaceId;
  size: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
};

export function Face({ faceId, size, className, style, priority }: FaceProps) {
  return (
    <Image
      src={getFaceUrl(faceId)}
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={className}
      style={style}
    />
  );
}
