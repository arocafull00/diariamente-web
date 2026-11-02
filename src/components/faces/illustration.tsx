import Image from "next/image";

import type { IllustrationName } from "@/lib/illustrations";
import { cn } from "@/lib/utils";

type IllustrationProps = {
  name: IllustrationName;
  className?: string;
};

export function Illustration({ name, className }: IllustrationProps) {
  return (
    <Image
      src={`/illustrations/${name}.svg`}
      alt=""
      aria-hidden="true"
      width={160}
      height={160}
      className={cn("size-12 shrink-0 object-contain", className)}
    />
  );
}
