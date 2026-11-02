import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Illustration } from "@/components/faces/illustration";
import { buttonVariants } from "@/components/ui/button";
import type { IllustrationName } from "@/lib/illustrations";
import { cn } from "@/lib/utils";

type ConnectStatusCardProps = {
  icon: LucideIcon | IllustrationName;
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
    <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-secondary p-6 text-center">
      {typeof Icon === "string" ? (
        <Illustration name={Icon} className="size-14" />
      ) : (
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-7" aria-hidden="true" />
        </div>
      )}
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {href && hrefLabel ? (
        <Link href={href} data-cuelume-tap="" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
          {hrefLabel}
        </Link>
      ) : null}
    </div>
  );
}
