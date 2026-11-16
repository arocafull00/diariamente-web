import Link from "next/link";

import { Illustration } from "@/components/faces/illustration";
import { buttonVariants } from "@/components/ui/button";
import type { IllustrationName } from "@/lib/illustrations";
import { cn } from "@/lib/utils";

type ConnectStatusCardProps = {
  icon?: IllustrationName;
  title: string;
  description: string;
  href?: string;
  hrefLabel?: string;
};

export function ConnectStatusCard({
  icon: Icon,
  title,
  description,
  href,
  hrefLabel,
}: ConnectStatusCardProps) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
      {Icon ? <Illustration name={Icon} className="size-14" /> : null}
      <div className="space-y-2">
        <h1 className="font-display text-2xl leading-tight font-medium text-balance text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {href && hrefLabel ? (
        <Link href={href} data-cuelume-tap="" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
          {hrefLabel}
        </Link>
      ) : null}
    </div>
  );
}
